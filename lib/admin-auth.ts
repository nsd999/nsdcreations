import "server-only";

import { cookies } from "next/headers";
import { createHash, createHmac, randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";


export const ADMIN_COOKIE = "nsd_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

const LOCKOUT_MINUTES = 15;
const MAX_FAILURES = 5;

type AdminSession = {
  sessionId: string;
  userId: string;
  username: string | null;
  lastAuthenticatedAt: string;
  expiresAt: string;
};

function hashValue(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return createHmac("sha256", secret).update(value).digest("hex");
  return createHash("sha256").update(value).digest("hex");
}

function scryptAsync(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: { N: number; r: number; p: number; maxmem?: number },
) {
  return new Promise<Buffer>((resolve, reject) => {
    nodeScrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(derivedKey);
    });
  });
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 1,
    maxmem: 128 * 1024 * 1024,
  })) as Buffer;

  return [
    "scrypt",
    "N32768",
    "r8",
    "p1",
    salt.toString("base64url"),
    derived.toString("base64url"),
  ].join("$");
}

async function verifyPassword(password: string, encoded: string) {
  const parts = encoded.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const N = Number(parts[1].replace(/^N/, ""));
  const r = Number(parts[2].replace(/^r/, ""));
  const p = Number(parts[3].replace(/^p/, ""));
  const salt = Buffer.from(parts[4], "base64url");
  const expected = Buffer.from(parts[5], "base64url");

  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p) || !salt.length || !expected.length) {
    return false;
  }

  try {
    const derived = (await scryptAsync(password, salt, expected.length, {
      N,
      r,
      p,
      maxmem: 128 * 1024 * 1024,
    })) as Buffer;

    if (derived.length !== expected.length) return false;

    for (let i = 0; i < expected.length; i += 1) {
      if (derived[i] !== expected[i]) return false;
    }

    return true;
  } catch {
    return false;
  }
}

function requestIp(request?: Request) {
  if (!request) return null;
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

function requestUserAgent(request?: Request) {
  return request?.headers.get("user-agent")?.slice(0, 500) || null;
}

export function getRequestMetadata(request?: Request) {
  const ip = requestIp(request);
  return {
    ip,
    ipHash: ip ? hashValue(ip) : null,
    userAgent: requestUserAgent(request),
  };
}

export async function ensureAdminCredential() {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("admin_credentials")
    .select("id,password_hash,username")
    .eq("id", "primary")
    .maybeSingle();

  if (error) throw error;
  if (data?.password_hash) {
    return data as { id: string; password_hash: string; username: string | null };
  }

  const bootstrap = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!bootstrap || bootstrap.length < 12) {
    throw new Error("Admin bootstrap credential is not configured.");
  }

  const passwordHash = await hashPassword(bootstrap);
  const username = process.env.ADMIN_USERNAME?.trim() || null;

  const { error: insertError } = await db.from("admin_credentials").upsert(
    {
      id: "primary",
      username,
      password_hash: passwordHash,
      password_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id", ignoreDuplicates: true },
  );

  if (insertError) throw insertError;

  const { data: created, error: readError } = await db
    .from("admin_credentials")
    .select("id,password_hash,username")
    .eq("id", "primary")
    .single();

  if (readError || !created) {
    throw readError || new Error("Unable to initialise admin credential.");
  }

  return created as { id: string; password_hash: string; username: string | null };
}

async function recordLoginAttempt(identifier: string, request: Request, succeeded: boolean) {
  const db = getSupabaseAdmin();
  const meta = getRequestMetadata(request);
  await db.from("admin_login_attempts").insert({
    identifier_hash: hashValue(identifier || "unknown"),
    ip_hash: meta.ipHash,
    succeeded,
    created_at: new Date().toISOString(),
  });
}

async function isLoginRateLimited(identifier: string, request: Request) {
  const db = getSupabaseAdmin();
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
  const identifierHash = hashValue(identifier || "unknown");

  const { data: identifierFailures, error } = await db
    .from("admin_login_attempts")
    .select("id")
    .eq("identifier_hash", identifierHash)
    .eq("succeeded", false)
    .gte("created_at", since);

  if (error) throw error;
  if ((identifierFailures?.length || 0) >= MAX_FAILURES) return true;

  const meta = getRequestMetadata(request);
  if (!meta.ipHash) return false;

  const { data: ipFailures, error: ipError } = await db
    .from("admin_login_attempts")
    .select("id")
    .eq("ip_hash", meta.ipHash)
    .eq("succeeded", false)
    .gte("created_at", since);

  if (ipError) throw ipError;
  return (ipFailures?.length || 0) >= MAX_FAILURES;
}

async function audit(
  action: string,
  summary: string,
  request?: Request,
  actor = "system",
  target: string | null = null,
) {
  try {
    const db = getSupabaseAdmin();
    const meta = getRequestMetadata(request);
    await db.from("audit_logs").insert({
      actor,
      action,
      target,
      summary,
      ip_address: meta.ip,
      user_agent: meta.userAgent,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Never expose audit infrastructure failures to users.
  }
}

export async function authenticateAdmin(identifier: string, password: string, request: Request) {
  if (await isLoginRateLimited(identifier, request)) {
    return { ok: false as const, locked: true as const };
  }

  const credential = await ensureAdminCredential();
  const configuredUsername = credential.username || process.env.ADMIN_USERNAME?.trim() || null;
  const usernameOk = configuredUsername ? identifier.trim() === configuredUsername : true;
  const passwordOk = await verifyPassword(password, credential.password_hash);
  const authenticated = usernameOk && passwordOk;

  await recordLoginAttempt(identifier, request, authenticated);

  if (!authenticated) {
    await audit("LOGIN_FAILURE", "Administrative login failed.", request);
    return { ok: false as const, locked: false as const };
  }

  const db = getSupabaseAdmin();
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionMatch = cookieHeader.match(new RegExp("(?:^|; )" + ADMIN_COOKIE + "=([^;]+)"));
  if (sessionMatch?.[1]) {
    await db
      .from("admin_sessions")
      .delete()
      .eq("token_hash", hashValue(decodeURIComponent(sessionMatch[1])));
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000).toISOString();

  const { data: session, error } = await db
    .from("admin_sessions")
    .insert({
      user_id: credential.id,
      token_hash: hashValue(token),
      expires_at: expiresAt,
      last_authenticated_at: new Date().toISOString(),
      user_agent: requestUserAgent(request),
      ip_hash: getRequestMetadata(request).ipHash,
    })
    .select("id,expires_at,last_authenticated_at")
    .single();

  if (error || !session) {
    throw error || new Error("Unable to create session.");
  }

  await audit("LOGIN_SUCCESS", "Administrative login succeeded.", request, credential.id);

  return {
    ok: true as const,
    token,
    expiresAt,
    sessionId: session.id as string,
  };
}

async function getAdminByToken(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;

  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("admin_sessions")
    .select("id,user_id,expires_at,last_authenticated_at,admin_credentials(username)")
    .eq("token_hash", hashValue(token))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;

  await db
    .from("admin_sessions")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", data.id);

  const credential = data.admin_credentials as { username?: string | null } | null;

  return {
    sessionId: data.id,
    userId: data.user_id,
    username: credential?.username || null,
    lastAuthenticatedAt: data.last_authenticated_at,
    expiresAt: data.expires_at,
  };
}

export async function getAdminFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp("(?:^|; )" + ADMIN_COOKIE + "=([^;]+)"));
  return getAdminByToken(match?.[1] ? decodeURIComponent(match[1]) : undefined);
}

export async function getServerAdmin() {
  const store = await cookies();
  return getAdminByToken(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

export async function requireRecentAdminAuthentication(request: Request) {
  const admin = await requireAdmin(request);
  const freshAfter = Date.now() - 15 * 60 * 1000;
  if (new Date(admin.lastAuthenticatedAt).getTime() < freshAfter) {
    throw new Error("REAUTH_REQUIRED");
  }
  return admin;
}

export async function revokeCurrentSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp("(?:^|; )" + ADMIN_COOKIE + "=([^;]+)"));
  if (!match?.[1]) return;

  const db = getSupabaseAdmin();
  await db
    .from("admin_sessions")
    .delete()
    .eq("token_hash", hashValue(decodeURIComponent(match[1])));
}

export async function revokeAllAdminSessions() {
  const db = getSupabaseAdmin();
  await db
    .from("admin_sessions")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
}

export async function rotateAdminPassword(request: Request, newPassword: string) {
  const admin = await requireRecentAdminAuthentication(request);
  if (newPassword.length < 12) throw new Error("PASSWORD_TOO_SHORT");

  const passwordHash = await hashPassword(newPassword);
  const db = getSupabaseAdmin();

  const { error } = await db
    .from("admin_credentials")
    .update({
      password_hash: passwordHash,
      password_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", admin.userId);

  if (error) throw error;

  await revokeAllAdminSessions();
  await audit("SECURITY_SETTING_CHANGED", "Administrator password rotated.", request, admin.userId);
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;

  const expected = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (expected && origin.replace(/\/$/, "") !== expected) {
    throw new Error("FORBIDDEN");
  }
}

export async function writeAuditLog(
  admin: AdminSession,
  action: string,
  summary: string,
  request: Request,
  target: string | null = null,
) {
  await audit(action, summary, request, admin.userId, target);
}

export function setAdminCookie(response: Response, token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    ADMIN_COOKIE +
      "=" +
      encodeURIComponent(token) +
      "; Path=/; Max-Age=" +
      ADMIN_SESSION_TTL_SECONDS +
      "; HttpOnly; SameSite=Strict" +
      secure,
  );
}

export function clearAdminCookie(response: Response) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    ADMIN_COOKIE + "=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict" + secure,
  );
}

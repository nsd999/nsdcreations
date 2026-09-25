import { NextResponse } from "next/server";
import { authenticateAdmin, ADMIN_SESSION_TTL_SECONDS, setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!password || password.length > 512) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const result = await authenticateAdmin(username, password, request);

    if (!result.ok) {
      if (result.locked) {
        return NextResponse.json(
          { error: "Too many attempts. Please try again later." },
          { status: 429 },
        );
      }

      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      expiresInSeconds: ADMIN_SESSION_TTL_SECONDS,
    });

    setAdminCookie(response, result.token);
    return response;
  } catch (error: any) {
    if (error?.message === "ADMIN_SESSION_SECRET_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
    }
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
}

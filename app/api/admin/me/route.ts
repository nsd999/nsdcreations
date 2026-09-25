import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({
    authenticated: true,
    username: admin.username,
    expiresAt: admin.expiresAt,
  });
}

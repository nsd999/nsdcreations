import { NextResponse } from "next/server";
import { clearAdminCookie, revokeCurrentSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    await revokeCurrentSession(request);
  } finally {
    const response = NextResponse.json({ success: true });
    clearAdminCookie(response);
    return response;
  }
}

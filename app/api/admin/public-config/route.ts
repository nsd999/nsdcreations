import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    usernameConfigured: Boolean(process.env.ADMIN_USERNAME),
  });
}

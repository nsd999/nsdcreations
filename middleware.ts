import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/nsdtheadmin/:path*"],
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/nsdtheadmin/login" || path.startsWith("/nsdtheadmin/login/")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("nsd_admin_session");
  if (!session?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/nsdtheadmin/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

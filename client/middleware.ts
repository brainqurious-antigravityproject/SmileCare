import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/payment", "/booking"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken");
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!token && isProtected) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If already logged in and visiting login/signup — redirect to dashboard
    if (token && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/payment/:path*",
        "/payment",
        "/booking/:path*",
        "/booking",
        "/login",
        "/signup",
    ],
};

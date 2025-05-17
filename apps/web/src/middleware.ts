import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "better-auth.session_token"; // Default session token cookie name

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if the user is trying to access a protected route (e.g., /dashboard and its sub-routes)
	if (pathname.startsWith("/dashboard") || pathname.startsWith("/agent") || pathname.startsWith("/admin")) {
		const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

		if (!sessionToken) {
			// User is not authenticated, redirect to login page
			const loginUrl = new URL("/login", request.url);
			// Add a callbackUrl so the user can be redirected back after login
			loginUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// If not a protected route or if the user is authenticated, allow the request to proceed
	return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
	matcher: [
		"/dashboard/:path*", // Protect the dashboard and all its sub-routes
		"/agent/:path*",     // Protect the agent portal and all its sub-routes
		"/admin/:path*",     // Protect the admin portal and all its sub-routes
	],
};

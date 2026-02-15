/**
 * Next.js Middleware — Route Protection
 * 
 * Verifies session cookies on protected routes.
 * Redirects unauthenticated users to the root page.
 * 
 * Note: This uses cookie presence check (not full verification)
 * because middleware runs on the edge and firebase-admin requires Node.js.
 * Full verification happens in API routes and server components.
 */

import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = '__session';

// Routes that require authentication
const PROTECTED_ROUTES = [
    '/dashboard',
    '/chat',
    '/profile',
    '/settings',
];

// Routes that are always public
const PUBLIC_ROUTES = [
    '/',
    '/api/auth',
];

function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest): NextResponse | undefined {
    const { pathname } = request.nextUrl;

    // Skip static assets and API routes (except auth checks)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return undefined;
    }

    // Public routes — always accessible
    if (isPublicRoute(pathname)) {
        return undefined;
    }

    // Protected routes — require session cookie
    if (isProtectedRoute(pathname)) {
        const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

        if (!sessionCookie?.value) {
            const loginUrl = new URL('/', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return undefined;
}

export const config = {
    matcher: [
        // Match all routes except static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

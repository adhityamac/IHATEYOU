/**
 * Current User API Route
 * 
 * GET: Reads session cookie → verifies → returns user info
 * Used for SSR/middleware auth checks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const SESSION_COOKIE_NAME = '__session';

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (!adminAuth) {
        return NextResponse.json(
            { authenticated: false, reason: 'server_auth_not_configured' },
            { status: 200 }
        );
    }

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
        return NextResponse.json(
            { authenticated: false, reason: 'no_session' },
            { status: 200 }
        );
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

        return NextResponse.json({
            authenticated: true,
            uid: decodedClaims.uid,
            email: decodedClaims.email ?? null,
            name: decodedClaims.name ?? null,
            picture: decodedClaims.picture ?? null,
        });
    } catch {
        // Invalid or expired session — clear cookie
        const response = NextResponse.json(
            { authenticated: false, reason: 'invalid_session' },
            { status: 200 }
        );

        response.cookies.set(SESSION_COOKIE_NAME, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        return response;
    }
}

/**
 * Session Management API Route
 * 
 * POST: Receives Firebase ID token → verifies → creates httpOnly secure cookie
 * DELETE: Clears session cookie (logout)
 * 
 * Security: httpOnly, secure, sameSite, 5-day expiry
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRY_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export async function POST(request: NextRequest): Promise<NextResponse> {
    // Rate limiting
    const ip = getClientIp(request);
    const rateResult = checkRateLimit(ip, { maxAttempts: 10, windowMs: 60_000 });
    if (!rateResult.allowed) {
        return NextResponse.json(
            { error: 'Too many requests. Try again later.' },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((rateResult.resetAt - Date.now()) / 1000).toString(),
                },
            }
        );
    }

    if (!adminAuth) {
        return NextResponse.json(
            { error: 'Server auth not configured' },
            { status: 503 }
        );
    }

    try {
        const body = await request.json();
        const { idToken } = body;

        if (!idToken || typeof idToken !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid ID token' },
                { status: 400 }
            );
        }

        // Verify the Firebase ID token
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // Create session cookie
        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: SESSION_EXPIRY_MS,
        });

        const response = NextResponse.json({
            status: 'success',
            uid: decodedToken.uid,
        });

        // Set httpOnly secure cookie
        response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SESSION_EXPIRY_MS / 1000,
            path: '/',
        });

        return response;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Authentication failed';
        console.error('Session creation failed:', message);
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
        );
    }
}

export async function DELETE(): Promise<NextResponse> {
    const response = NextResponse.json({ status: 'signed_out' });

    response.cookies.set(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });

    return response;
}

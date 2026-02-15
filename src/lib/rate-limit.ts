/**
 * In-Memory Rate Limiter for API Routes
 * 
 * Tracks requests per IP within a sliding window.
 * Designed for serverless (Next.js API routes).
 * 
 * Limitation: In-memory store resets on cold start.
 * For production at scale, use Redis or Upstash.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leaks
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(): void {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
    lastCleanup = now;

    for (const [key, entry] of store) {
        if (now > entry.resetAt) {
            store.delete(key);
        }
    }
}

export interface RateLimitConfig {
    /** Max requests allowed within the window */
    maxAttempts: number;
    /** Window duration in milliseconds */
    windowMs: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
};

/**
 * Check if a request from the given identifier is allowed.
 * 
 * @param identifier — typically IP address or user ID
 * @param config — rate limit configuration
 * @returns whether the request is allowed + remaining attempts
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
    cleanup();

    const now = Date.now();
    const entry = store.get(identifier);

    // No entry or expired window — allow and start fresh
    if (!entry || now > entry.resetAt) {
        store.set(identifier, {
            count: 1,
            resetAt: now + config.windowMs,
        });
        return {
            allowed: true,
            remaining: config.maxAttempts - 1,
            resetAt: now + config.windowMs,
        };
    }

    // Within window
    if (entry.count < config.maxAttempts) {
        entry.count++;
        return {
            allowed: true,
            remaining: config.maxAttempts - entry.count,
            resetAt: entry.resetAt,
        };
    }

    // Rate limited
    return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
    };
}

/**
 * Extract client IP from request headers.
 * Handles Vercel, Cloudflare, and standard proxies.
 */
export function getClientIp(request: Request): string {
    const headers = request.headers;

    // Vercel
    const xForwardedFor = headers.get('x-forwarded-for');
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }

    // Cloudflare
    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) return cfConnectingIp;

    // Standard
    const xRealIp = headers.get('x-real-ip');
    if (xRealIp) return xRealIp;

    return 'unknown';
}

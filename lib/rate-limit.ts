/**
 * Edge-compatible in-memory sliding window rate limiter.
 * Operates efficiently in Cloudflare Workers and Node.js runtimes.
 */

interface RateLimitConfig {
  limit: number; // Max allowed requests
  windowMs: number; // Time window in milliseconds
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class SlidingWindowRateLimiter {
  private cache: Map<string, RateLimitRecord>;
  private config: RateLimitConfig;
  private lastCleanup: number;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cache = new Map();
    this.lastCleanup = Date.now();
  }

  private cleanup() {
    const now = Date.now();
    // Clean up expired items every 60 seconds
    if (now - this.lastCleanup > 60000) {
      this.lastCleanup = now;
      for (const [key, record] of this.cache.entries()) {
        if (now > record.resetAt) {
          this.cache.delete(key);
        }
      }
    }
  }

  public check(identifier: string): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    this.cleanup();
    const now = Date.now();
    const record = this.cache.get(identifier);

    if (!record || now > record.resetAt) {
      // First request or window expired
      const resetAt = now + this.config.windowMs;
      this.cache.set(identifier, {
        count: 1,
        resetAt,
      });

      return {
        success: true,
        limit: this.config.limit,
        remaining: this.config.limit - 1,
        reset: Math.ceil(resetAt / 1000),
      };
    }

    if (record.count >= this.config.limit) {
      // Rate limit exceeded
      return {
        success: false,
        limit: this.config.limit,
        remaining: 0,
        reset: Math.ceil(record.resetAt / 1000),
      };
    }

    // Increment count
    record.count += 1;
    return {
      success: true,
      limit: this.config.limit,
      remaining: this.config.limit - record.count,
      reset: Math.ceil(record.resetAt / 1000),
    };
  }
}

// Tailored rate limiter instances for EduNexus:
// 1. Strict limit for authentication (prevent brute-force): 10 req / 60s
export const authRateLimiter = new SlidingWindowRateLimiter({
  limit: 10,
  windowMs: 60 * 1000,
});

// 2. Strict limit for R2 presigned URL generation (prevent storage abuse): 25 req / 60s
export const uploadRateLimiter = new SlidingWindowRateLimiter({
  limit: 25,
  windowMs: 60 * 1000,
});

// 3. General public API limiter: 100 req / 60s
export const apiRateLimiter = new SlidingWindowRateLimiter({
  limit: 100,
  windowMs: 60 * 1000,
});

/**
 * Extracts client IP safely across Cloudflare, proxies, and localhost.
 */
export function getClientIp(req: Request): string {
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp;

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  return "127.0.0.1";
}

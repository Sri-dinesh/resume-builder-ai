import { NextRequest, NextResponse } from "next/server";

// In-memory store for rate limiting (resets on cold start, which is fine for our use case)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 requests per minute per IP
const PING_SECRET = process.env.PING_SECRET;

/**
 * Simple rate limiter
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean up old entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
}

/**
 * Validate ping request
 */
function validatePingRequest(request: NextRequest): {
  valid: boolean;
  reason?: string;
} {
  const authHeader = request.headers.get("x-ping-secret");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Allow requests without secret for external monitoring services (UptimeRobot, etc.)
  // They can't set custom headers, so we allow them through
  if (!authHeader) {
    // Check if it's from a known monitoring service or direct request
    const userAgent = request.headers.get("user-agent") || "";
    const isMonitoringService =
      userAgent.includes("UptimeRobot") ||
      userAgent.includes("Pingdom") ||
      userAgent.includes("curl") ||
      userAgent.includes("StatusCake") ||
      !origin; // Direct requests (no origin = likely monitoring)

    if (isMonitoringService) {
      return { valid: true };
    }
  }

  // For requests with origin (browser requests), validate the secret
  if (origin || referer) {
    // Check if from allowed domains
    const allowedDomains = [
      "localhost",
      "sparkcv.onrender.com",
      "sparkcv.vercel.app",
    ];

    const requestOrigin = origin || referer || "";
    const isAllowedDomain = allowedDomains.some((domain) =>
      requestOrigin.includes(domain),
    );

    if (!isAllowedDomain) {
      return { valid: false, reason: "Invalid origin" };
    }

    // Validate secret for client-side pings
    if (authHeader && authHeader !== PING_SECRET) {
      return { valid: false, reason: "Invalid secret" };
    }
  }

  return { valid: true };
}

const formatTimestamp12Hour = (): string => {
  const d = new Date();
  let h = d.getHours();
  const p: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()} ${h}:${String(d.getMinutes()).padStart(
    2,
    "0",
  )}:${String(d.getSeconds()).padStart(2, "0")} ${p}`;
};

/**
 * GET /api/health - Health check endpoint
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  // Get client IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  // Rate limiting
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        status: "error",
        message: "Too many requests",
        retryAfter: 60,
      },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // Validate request
  const validation = validatePingRequest(request);
  if (!validation.valid) {
    return NextResponse.json(
      { status: "error", message: validation.reason },
      { status: 403 },
    );
  }

  // Calculate response time
  const responseTime = Date.now() - startTime;

  // Log the ping (useful for monitoring)
  console.log(
    `[Health Check] IP: ${ip.substring(0, 10)}*** | Time: ${formatTimestamp12Hour()} | ResponseTime: ${responseTime}ms`,
  );

  return NextResponse.json(
    {
      status: "alive",
      timestamp: formatTimestamp12Hour(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      version: "1.0.0",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-RateLimit-Remaining": remaining.toString(),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "x-ping-secret",
      },
    },
  );
}

/**
 * HEAD /api/health - Lightweight health check (for monitoring services)
 */
export async function HEAD(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return new NextResponse(null, { status: 429 });
  }

  console.log(
    `[Health Check HEAD] IP: ${ip.substring(0, 10)}*** | Time: ${formatTimestamp12Hour()}`,
  );

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

/**
 * OPTIONS /api/health - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "x-ping-secret, content-type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

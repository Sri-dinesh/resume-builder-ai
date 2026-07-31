import { NextResponse } from "next/server";
import prisma from "@/lib/db/client";
import { logger } from "@/lib/logger";

interface HealthCheckResult {
  status: "pass" | "fail";
  latencyMs: number;
}

async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "pass", latencyMs: Date.now() - start };
  } catch {
    return { status: "fail", latencyMs: Date.now() - start };
  }
}

function getAppVersion(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pkg = require("../../../../package.json") as { version: string };
    return pkg.version;
  } catch {
    return "unknown";
  }
}

export async function GET() {
  const version = getAppVersion();
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";
  let httpStatus = 200;

  let dbCheck: HealthCheckResult;

  try {
    dbCheck = await checkDatabase();

    if (dbCheck.status === "fail") {
      overallStatus = "degraded";
      logger.warn("Health check: database check failed", { route: "/api/health" });
    }
  } catch (error) {
    overallStatus = "unhealthy";
    httpStatus = 503;
    dbCheck = { status: "fail", latencyMs: 0 };
    logger.error("Health check: database threw", {
      route: "/api/health",
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const body = {
    status: overallStatus,
    version,
    environment: process.env.NODE_ENV ?? "unknown",
    uptime: process.uptime(),
    checks: {
      database: {
        status: dbCheck.status,
        latencyMs: dbCheck.latencyMs,
      },
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

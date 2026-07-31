type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta extends Record<string, unknown> {
  requestId?: string;
  userId?: string;
  route?: string;
  durationMs?: number;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

const COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m", // cyan
  info: "\x1b[32m",  // green
  warn: "\x1b[33m",  // yellow
  error: "\x1b[31m", // red
};
const RESET = "\x1b[0m";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatDev(level: LogLevel, msg: string, meta?: LogMeta): string {
  const ts = new Date().toISOString();
  const color = COLORS[level];
  const tag = `${color}[${level.toUpperCase()}]${RESET}`;
  const metaStr =
    meta && Object.keys(meta).length > 0
      ? ` | ${JSON.stringify(meta)}`
      : "";
  return `${tag} [${ts}] ${msg}${metaStr}`;
}

function formatProd(level: LogLevel, msg: string, meta?: LogMeta): string {
  return JSON.stringify({
    level,
    ts: new Date().toISOString(),
    msg,
    ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
  });
}

function log(level: LogLevel, msg: string, meta?: LogMeta): void {
  if (!shouldLog(level)) return;

  const output =
    process.env.NODE_ENV === "production"
      ? formatProd(level, msg, meta)
      : formatDev(level, msg, meta);

  switch (level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    default:
      // Using console.error for structured output to avoid Next.js
      // removeConsole stripping it in production
      if (process.env.NODE_ENV === "production") {
        console.error(output);
      } else {
        // eslint-disable-next-line no-console
        console.log(output);
      }
  }
}

export const logger = {
  debug: (msg: string, meta?: LogMeta) => log("debug", msg, meta),
  info: (msg: string, meta?: LogMeta) => log("info", msg, meta),
  warn: (msg: string, meta?: LogMeta) => log("warn", msg, meta),
  error: (msg: string, meta?: LogMeta) => log("error", msg, meta),
};

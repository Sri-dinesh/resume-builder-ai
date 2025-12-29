/**
 * Self-Ping Utility for Render Free Tier
 *
 * This module provides a robust ping mechanism with:
 * - Recursive timeouts (better than setInterval for background tabs)
 * - Tab wake-up recovery
 * - Session tracking
 */

// Configuration
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes
const HEALTH_ENDPOINT = "/api/health";

// State
let timeoutId: NodeJS.Timeout | null = null;
let lastPingTime = 0;
let isRunning = false;
let sessionId: string | null = null;

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

async function pingHealthEndpoint() {
  if (!isRunning) return;

  try {
    const now = new Date();
    // Log to console so you can verify it's working
    console.log(
      `[SystemHeartbeat] 💓 Pinging server at ${now.toLocaleTimeString()}...`,
    );

    const response = await fetch(HEALTH_ENDPOINT, {
      method: "GET",
      headers: {
        "x-ping-secret": process.env.NEXT_PUBLIC_PING_SECRET || "",
        "x-session-id": sessionId || "",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    if (response.ok) {
      lastPingTime = Date.now();
      console.log(`[SystemHeartbeat] ✅ Server active. Next ping in ~5 mins.`);
    } else {
      console.warn(
        `[SystemHeartbeat] ⚠️ Server responded with status: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("[SystemHeartbeat] ❌ Ping failed:", error);
  } finally {
    // Schedule the next ping regardless of success/failure
    if (isRunning) {
      scheduleNextPing();
    }
  }
}

function scheduleNextPing() {
  if (timeoutId) clearTimeout(timeoutId);
  // Use a slight random jitter (0-5s) to avoid thundering herd if multiple tabs open
  const jitter = Math.floor(Math.random() * 5000);
  timeoutId = setTimeout(pingHealthEndpoint, PING_INTERVAL + jitter);
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    const now = Date.now();
    const timeSinceLastPing = now - lastPingTime;

    // If we missed a ping (or it's been longer than interval), ping immediately
    if (timeSinceLastPing >= PING_INTERVAL) {
      console.log("[SystemHeartbeat] 👁️ Tab active. Recovering missed ping...");
      if (timeoutId) clearTimeout(timeoutId);
      pingHealthEndpoint();
    }
  }
}

export function startPingSystem() {
  if (isRunning) return; // Prevent multiple starts

  if (!sessionId) {
    sessionId = generateSessionId();
  }

  console.log(
    `[SystemHeartbeat] 🚀 System Heartbeat started (5 min interval) Session: ${sessionId}`,
  );
  isRunning = true;

  // Initial ping
  pingHealthEndpoint();

  // Listen for tab wake-ups
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }
}

export function stopPingSystem() {
  console.log("[SystemHeartbeat] 🛑 System Heartbeat stopped");
  isRunning = false;
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = null;

  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  }
}

// Compatibility exports
export const startHeartbeat = startPingSystem;
export const stopHeartbeat = stopPingSystem;

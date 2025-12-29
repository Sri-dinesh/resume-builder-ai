"use client";

import { useEffect, useRef } from "react";
import { startPingSystem, stopPingSystem } from "@/lib/system-heartbeat";

interface SystemHeartbeatProps {
  /**
   * Enable debug mode to see ping status in console
   * @default false
   */
  debug?: boolean;
  /**
   * Disable the system heartbeat
   * @default false
   */
  disabled?: boolean;
}

/**
 * SystemHeartbeat Component
 *
 * A transparent component that keeps the Render-hosted app alive
 * by pinging the health endpoint every 5 minutes.
 *
 * Features:
 * - Zero UI impact
 * - Works in background tabs
 * - Automatic retry with exponential backoff
 * - Session tracking
 *
 * Usage:
 * ```tsx
 * // In your root layout or app component
 * <SystemHeartbeat />
 *
 * // With debug mode
 * <SystemHeartbeat debug />
 *
 * // Disabled in development
 * <SystemHeartbeat disabled={process.env.NODE_ENV === 'development'} />
 * ```
 */
export function SystemHeartbeat({
  debug = false,
  disabled = false,
}: SystemHeartbeatProps) {
  const isStartedRef = useRef(false);

  useEffect(() => {
    // Don't start if disabled or already started
    if (disabled || isStartedRef.current) {
      return;
    }

    // Only run in browser
    if (typeof window === "undefined") {
      return;
    }

    // Start the ping system
    isStartedRef.current = true;
    startPingSystem();

    // Cleanup on unmount
    return () => {
      stopPingSystem();
      isStartedRef.current = false;
    };
  }, [debug, disabled]);

  // This component renders nothing - completely transparent
  return null;
}

export default SystemHeartbeat;

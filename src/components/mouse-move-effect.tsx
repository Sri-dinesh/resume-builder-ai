"use client";

declare global {
  interface Window {
    moveTimeout: number;
  }
}

import { useEffect, useState, useCallback } from "react";
import { throttle } from "lodash";

export default function MouseMoveEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  // Throttle the mouse move handler to improve performance
  const handleMouseMove = useCallback(
    throttle((event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      setIsMoving(true);

      // Reset the moving state after a delay
      clearTimeout(window.moveTimeout);
      window.moveTimeout = setTimeout(() => {
        setIsMoving(false);
      }, 300) as unknown as number;
    }, 50),
    [],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(window.moveTimeout);
    };
  }, [handleMouseMove]);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500"
        style={{
          opacity: isMoving ? 1 : 0.5,
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-700"
        style={{
          opacity: isMoving ? 0.7 : 0.3,
          background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.06), transparent 80%)`,
        }}
      />
    </>
  );
}

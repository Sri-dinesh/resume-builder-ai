"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUser, GripHorizontal, PenLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { steps } from "./steps";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
  isSaving: boolean;
}

export default function Footer({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
  isSaving,
}: FooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 80 });
  const [mounted, setMounted] = useState(false);
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const updateInitialPosition = () => {
      if (!containerRef.current) return;

      const { offsetWidth } = containerRef.current;
      setPosition((currentPosition) => {
        const nextX = Math.max(window.innerWidth - offsetWidth - 16, 0);

        if (currentPosition.x === 0) {
          return { x: nextX, y: currentPosition.y };
        }

        return {
          x: Math.min(currentPosition.x, Math.max(window.innerWidth - offsetWidth, 0)),
          y: currentPosition.y,
        };
      });
    };

    updateInitialPosition();
    window.addEventListener("resize", updateInitialPosition);

    return () => window.removeEventListener("resize", updateInitialPosition);
  }, [mounted]);

  function clampPosition(x: number, y: number) {
    const element = containerRef.current;

    if (!element) {
      return { x, y };
    }

    return {
      x: Math.min(Math.max(x, 0), Math.max(window.innerWidth - element.offsetWidth, 0)),
      y: Math.min(Math.max(y, 0), Math.max(window.innerHeight - element.offsetHeight, 0)),
    };
  }

  function handleDragStart(event: React.PointerEvent<HTMLButtonElement>) {
    const element = containerRef.current;

    if (!element) return;

    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    setPosition(
      clampPosition(
        event.clientX - dragOffsetRef.current.x,
        event.clientY - dragOffsetRef.current.y,
      ),
    );
  }

  function handleDragEnd(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-30 flex max-w-full flex-wrap items-center justify-end gap-2"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <p
        className={cn(
          "order-3 w-full text-right text-xs text-muted-foreground opacity-0 transition-opacity md:order-none md:w-auto",
          isSaving && "opacity-100",
        )}
      >
        Saving...
      </p>
      <div className="flex items-center gap-2 rounded-full border bg-background px-2 py-1 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="h-8 w-8 cursor-grab touch-none rounded-full text-muted-foreground active:cursor-grabbing"
          title="Drag controls"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <GripHorizontal className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/resumes">Close</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={previousStep ? () => setCurrentStep(previousStep) : undefined}
          disabled={!previousStep}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
          disabled={!nextStep}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
          className="md:hidden"
          title={
            showSmResumePreview ? "Show input form" : "Show resume preview"
          }
        >
          {showSmResumePreview ? <PenLine /> : <FileUser />}
        </Button>
      </div>
    </div>
  );
}

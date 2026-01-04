import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { Circle, Square, LucideProps } from "lucide-react"; // Removed 'Squircle' from import
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";
import { forwardRef } from "react";

// 1. Define the missing Squircle icon manually
const SquircleIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* A path representing a squircle (superellipse) */}
      <path d="M12 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6" />
    </svg>
  ),
);
SquircleIcon.displayName = "SquircleIcon";

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};

const borderStyles = Object.values(BorderStyles);

interface BorderStyleButtonProps {
  borderStyle: string | undefined;
  onChange: (borderStyle: string) => void;
}

export default function BorderStyleButton({
  borderStyle,
  onChange,
}: BorderStyleButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();

  function handleClick() {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }

    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    onChange(borderStyles[nextIndex]);
  }

  // 2. Update the Icon variable to use the manual SquircleIcon
  const Icon =
    borderStyle === "square"
      ? Square
      : borderStyle === "circle"
        ? Circle
        : SquircleIcon;

  return (
    <Button
      variant="outline"
      size="icon"
      title="Change border style"
      onClick={handleClick}
    >
      <Icon className="size-5" />
    </Button>
  );
}

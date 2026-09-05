import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/billing/permissions";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

export const HeaderAlignments = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};

const headerAlignments = Object.values(HeaderAlignments);

interface HeaderAlignmentButtonProps {
  headerAlignment: string | undefined;
  onChange: (headerAlignment: string) => void;
}

export default function HeaderAlignmentButton({
  headerAlignment,
  onChange,
}: HeaderAlignmentButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();

  function handleClick() {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }

    const currentIndex = headerAlignment ? headerAlignments.indexOf(headerAlignment) : 1; // Default to center
    const nextIndex = (currentIndex + 1) % headerAlignments.length;
    onChange(headerAlignments[nextIndex]);
  }

  const Icon =
    headerAlignment === "left"
      ? AlignLeft
      : headerAlignment === "right"
        ? AlignRight
        : AlignCenter;

  return (
    <Button
      variant="outline"
      size="icon"
      title="Change header alignment"
      onClick={handleClick}
    >
      <Icon className="size-5" />
    </Button>
  );
}

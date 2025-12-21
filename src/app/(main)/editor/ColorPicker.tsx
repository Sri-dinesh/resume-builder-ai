import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { Palette } from "lucide-react";
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();

  const premiumModal = usePremiumModal();

  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Change resume color"
          onClick={() => {
            if (!canUseCustomizations(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(true);
          }}
        >
          <Palette className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none"
        align="end"
      >
        <TwitterPicker
          color={color}
          onChange={onChange}
          triangle="top-right"
          colors={[
            "#000000",
            "#F44336",
            "#E91E63",
            "#9C27B0",
            "#673AB7",
            "#3F51B5",
            "#2196F3",
            "#03A9F4",
            "#00BCD4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
          ]}
        />
      </PopoverContent>
    </Popover>
  );
}

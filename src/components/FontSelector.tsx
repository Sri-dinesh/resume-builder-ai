import { FONT_OPTIONS } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon } from "lucide-react";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { useSubscriptionLevel } from "@/app/(main)/SubscriptionLevelProvider";

interface FontSelectorProps {
  value: string; // Currently selected font
  onValueChange: (value: string) => void; // Callback to update the selected font
}

export function FontSelector({ value, onValueChange }: FontSelectorProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();

  function handleFontChange(newValue: string) {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }
    onValueChange(newValue); // Update the font only if the user has permission
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Font Selector Button */}
        <Button variant="outline" size="icon" title="Change font style">
          <span
            className="size-5 font-bold"
            style={{ fontFamily: value || "inherit" }}
          >
            Aa
          </span>
        </Button>
      </PopoverTrigger>

      {/* Font Options Popover Content */}
      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          {FONT_OPTIONS.map((font) => (
            <Button
              key={font.value}
              variant={value === font.value ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleFontChange(font.value)}
              style={{ fontFamily: font.value }}
            >
              {value === font.value && <CheckIcon className="mr-2 size-4" />}
              {font.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

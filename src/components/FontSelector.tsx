import { FONT_OPTIONS } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon } from "lucide-react";

interface FontSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function FontSelector({ value, onValueChange }: FontSelectorProps) {
  // const subscriptionLevel = useSubscriptionLevel();
  // const premiumModal = usePremiumModal();

  function handleFontChange(newValue: string) {
    // if (!canUseCustomizations(subscriptionLevel)) {
    //   premiumModal.setOpen(true);
    //   return;
    // }
    onValueChange(newValue);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" title="Change font style">
          <span
            className="size-5 font-bold"
            style={{ fontFamily: value || "inherit" }}
          >
            Aa
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2" align="start">
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {FONT_OPTIONS.map((font) => (
            <Button
              key={font.value}
              variant={value === font.value ? "secondary" : "ghost"}
              className="h-auto w-full justify-start py-2 text-left"
              onClick={() => handleFontChange(font.value)}
              style={{ fontFamily: font.value }}
            >
              {/* {value === font.value && <CheckIcon className="mr-2 size-4" />}
              {font.name} */}
              <div className="flex w-full items-start">
                {value === font.value && (
                  <CheckIcon className="mr-2 mt-0.5 size-4 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{font.name}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

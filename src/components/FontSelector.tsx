// import { FONT_OPTIONS } from "@/lib/fonts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { FormDescription } from "./ui/form";
// import usePremiumModal from "@/hooks/usePremiumModal";
// import { canUseCustomizations } from "@/lib/permissions";
// import { useSubscriptionLevel } from "@/app/(main)/SubscriptionLevelProvider";

// interface FontSelectorProps {
//   value: string; // Currently selected font
//   onValueChange: (value: string) => void; // Callback to update the selected font
// }

// export function FontSelector({ value, onValueChange }: FontSelectorProps) {
//   const subscriptionLevel = useSubscriptionLevel();
//   const premiumModal = usePremiumModal();

//   function handleFontChange(newValue: string) {
//     if (!canUseCustomizations(subscriptionLevel)) {
//       premiumModal.setOpen(true);
//       return;
//     }
//     onValueChange(newValue); // Update the font only if the user has permission
//   }

//   return (
//     <div className="space-y-2">
//       <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//         Font Style
//       </label>
//       <Select value={value} onValueChange={handleFontChange}>
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder="Select font" />
//         </SelectTrigger>
//         <SelectContent>
//           {FONT_OPTIONS.map((font) => (
//             <SelectItem
//               key={font.value}
//               value={font.value}
//               style={{ fontFamily: font.value }}
//             >
//               <div className="flex flex-col space-y-1">
//                 <span className="font-medium">{font.name}</span>
//                 <span className="text-xs text-muted-foreground">
//                   {font.preview}
//                 </span>
//               </div>
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <FormDescription>Choose a font style for your resume</FormDescription>
//     </div>
//   );
// }

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

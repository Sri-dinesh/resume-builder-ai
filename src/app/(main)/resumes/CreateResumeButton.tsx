"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { Loader2, PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  const premiumModal = usePremiumModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push("/editor");
  };

  if (canCreate) {
    return (
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className="mx-auto flex w-fit gap-2"
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <PlusSquare className="size-5" />
        )}
        New resume
      </Button>
    );
  }

  return (
    <Button
      onClick={() => premiumModal.setOpen(true)}
      className="mx-auto flex w-fit gap-2"
    >
      <PlusSquare className="size-5" />
      New resume
    </Button>
  );
}

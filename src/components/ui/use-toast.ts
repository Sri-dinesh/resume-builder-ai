"use client";

import type React from "react";

// Adapted from: https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/use-toast.ts
import { useState, useCallback } from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type UseToast = {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (toastId: string) => void;
};

export const useToast = (): UseToast => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((toastId: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId));
  }, []);

  const toast = useCallback(
    ({ ...props }: Omit<Toast, "id">) => {
      const id = genId();

      const newToast = {
        id,
        ...props,
      };

      setToasts((toasts) => [newToast, ...toasts].slice(0, TOAST_LIMIT));

      setTimeout(() => {
        dismiss(id);
      }, TOAST_REMOVE_DELAY);

      return id;
    },
    [dismiss],
  );

  return {
    toasts,
    toast,
    dismiss,
  };
};

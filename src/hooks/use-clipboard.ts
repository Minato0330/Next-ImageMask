"use client";

import { useCallback } from "react";
import { toast } from "sonner";

export function useClipboard() {
  const copy = useCallback(async (text: string, label = "CSS") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  return { copy };
}

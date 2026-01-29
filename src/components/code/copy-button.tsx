"use client";

import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "CSS" }: CopyButtonProps) {
  const { copy } = useClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await copy(text, label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text, label, copy]);

  return (
    <Button variant="ghost" size="icon-xs" onClick={handleCopy}>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

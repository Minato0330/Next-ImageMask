"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudioStore } from "@/hooks/use-studio-store";
import { BLEND_MODES } from "@/lib/constants";
import type { BlendMode } from "@/lib/types";

export function BlendModePanel() {
  const blendMode = useStudioStore((s) => s.blendMode);
  const setBlendMode = useStudioStore((s) => s.setBlendMode);

  return (
    <Select
      value={blendMode}
      onValueChange={(v) => setBlendMode(v as BlendMode)}
    >
      <SelectTrigger className="h-8 text-xs" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {BLEND_MODES.map((mode) => (
          <SelectItem key={mode} value={mode} className="text-xs">
            {mode}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

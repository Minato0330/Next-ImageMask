"use client";

import { Input } from "@/components/ui/input";

interface PositionInputProps {
  label: string;
  x: string;
  y: string;
  onChangeX: (value: string) => void;
  onChangeY: (value: string) => void;
}

export function PositionInput({ label, x, y, onChangeX, onChangeY }: PositionInputProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-[13px] text-muted-foreground">{label}</span>
      <div className="flex flex-1 items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground">X</span>
        <Input
          value={x}
          onChange={(e) => onChangeX(e.target.value)}
          className="h-8 flex-1 font-mono text-xs"
        />
        <span className="text-[11px] text-muted-foreground">Y</span>
        <Input
          value={y}
          onChange={(e) => onChangeY(e.target.value)}
          className="h-8 flex-1 font-mono text-xs"
        />
      </div>
    </div>
  );
}

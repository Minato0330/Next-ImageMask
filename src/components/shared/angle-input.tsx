"use client";

import { Input } from "@/components/ui/input";

interface AngleInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AngleInput({ label, value, onChange }: AngleInputProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-[13px] text-muted-foreground">{label}</span>
      <Input
        type="number"
        value={value}
        min={0}
        max={360}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 flex-1 font-mono text-xs"
      />
      <span className="text-[11px] text-muted-foreground">deg</span>
    </div>
  );
}

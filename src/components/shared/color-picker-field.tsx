"use client";

import { Input } from "@/components/ui/input";
import { GradientColorPicker } from "./gradient-color-picker";

interface ColorPickerFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
}

export function ColorPickerField({ label, value, onChange, opacity, onOpacityChange }: ColorPickerFieldProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="w-16 shrink-0 text-[13px] text-muted-foreground">{label}</span>
      )}
      <GradientColorPicker
        color={value.startsWith("#") ? value : "#000000"}
        opacity={opacity}
        onChange={onChange}
        onOpacityChange={onOpacityChange}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 flex-1 font-mono text-xs"
      />
    </div>
  );
}

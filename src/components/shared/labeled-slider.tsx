"use client";

import { Slider } from "@/components/ui/slider";

interface LabeledSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: LabeledSliderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-[13px] text-muted-foreground">{label}</span>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="flex-1"
      />
      <span className="w-12 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {value}{unit}
      </span>
    </div>
  );
}

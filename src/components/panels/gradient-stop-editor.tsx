"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { GradientColorPicker } from "@/components/shared/gradient-color-picker";
import type { GradientStop } from "@/lib/types";

interface GradientStopEditorProps {
  stop: GradientStop;
  isSelected: boolean;
  canDelete: boolean;
  swatchColors: string[];
  onUpdate: (changes: Partial<GradientStop>) => void;
  onDelete: () => void;
  onSelect: () => void;
}

export function GradientStopEditor({
  stop,
  isSelected,
  canDelete,
  swatchColors,
  onUpdate,
  onDelete,
  onSelect,
}: GradientStopEditorProps) {
  return (
    <div
      className={`rounded-md px-2.5 py-2 space-y-1.5 cursor-pointer transition-colors ${
        isSelected
          ? "ring-2 ring-primary/30 bg-muted/60 shadow-sm"
          : "bg-muted/40 hover:bg-muted/50 hover:shadow-sm"
      }`}
      onClick={onSelect}
    >
      {/* Row 1: Color picker, hex, position, delete */}
      <div className="flex items-center gap-2">
        <GradientColorPicker
          color={stop.color.startsWith("#") ? stop.color : "#000000"}
          opacity={stop.opacity}
          onChange={(color) => onUpdate({ color })}
          onOpacityChange={(opacity) => onUpdate({ opacity })}
          swatchColors={swatchColors}
        />
        <Input
          value={stop.color.startsWith("#") ? stop.color : "#000000"}
          onChange={(e) => {
            const val = e.target.value;
            if (val.match(/^#[0-9A-Fa-f]{0,6}$/)) {
              onUpdate({ color: val });
            }
          }}
          className="h-7 w-20 font-mono text-[11px]"
          maxLength={7}
          onClick={(e) => e.stopPropagation()}
        />
        <Input
          type="number"
          value={stop.position}
          min={0}
          max={100}
          onChange={(e) => onUpdate({ position: Number(e.target.value) })}
          className="h-7 w-14 font-mono text-[11px]"
          onClick={(e) => e.stopPropagation()}
        />
        <span className="text-[11px] text-muted-foreground">%</span>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={!canDelete}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Row 2: Opacity slider full width */}
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[11px] text-muted-foreground">Opacity</span>
        <Slider
          value={[stop.opacity]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={([v]) => onUpdate({ opacity: v })}
          className="flex-1"
        />
        <span className="w-8 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
          {Math.round(stop.opacity * 100)}%
        </span>
      </div>
    </div>
  );
}

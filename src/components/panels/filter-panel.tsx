"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LabeledSlider } from "@/components/shared/labeled-slider";
import { ColorPickerField } from "@/components/shared/color-picker-field";

import { useStudioStore } from "@/hooks/use-studio-store";
import { FILTER_CONFIG } from "@/lib/constants";
import { BlendModePanel } from "./blend-mode-panel";
import type { Filters } from "@/lib/types";

export function FilterPanel() {
  const filters = useStudioStore((s) => s.filters);
  const setFilter = useStudioStore((s) => s.setFilter);
  const setDropShadow = useStudioStore((s) => s.setDropShadow);
  const resetFilters = useStudioStore((s) => s.resetFilters);

  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border border-border/50 bg-card/30">
        <div className="px-3 py-2.5">
          <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">CSS Filters</span>
        </div>
        <div className="px-3 pb-3 space-y-3">
          {FILTER_CONFIG.map((cfg) => (
            <LabeledSlider
              key={cfg.key}
              label={cfg.label}
              value={filters[cfg.key as keyof Omit<Filters, "dropShadow">] as number}
              min={cfg.min}
              max={cfg.max}
              unit={cfg.unit}
              onChange={(value) =>
                setFilter(cfg.key as keyof Omit<Filters, "dropShadow">, value)
              }
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-card/30 px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">Drop Shadow</span>
          <Switch
            checked={filters.dropShadow.enabled}
            onCheckedChange={(enabled) => setDropShadow({ enabled })}
          />
        </div>
        {filters.dropShadow.enabled && (
          <div className="space-y-3 pt-3">
            <LabeledSlider
              label="X"
              value={filters.dropShadow.x}
              min={-50}
              max={50}
              unit="px"
              onChange={(x) => setDropShadow({ x })}
            />
            <LabeledSlider
              label="Y"
              value={filters.dropShadow.y}
              min={-50}
              max={50}
              unit="px"
              onChange={(y) => setDropShadow({ y })}
            />
            <LabeledSlider
              label="Blur"
              value={filters.dropShadow.blur}
              min={0}
              max={50}
              unit="px"
              onChange={(blur) => setDropShadow({ blur })}
            />
            <ColorPickerField
              label="Color"
              value={filters.dropShadow.color}
              onChange={(color) => setDropShadow({ color })}
              opacity={filters.dropShadow.colorOpacity}
              onOpacityChange={(colorOpacity) => setDropShadow({ colorOpacity })}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border/50 bg-card/30">
        <div className="px-3 py-2.5">
          <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">Blend Mode</span>
        </div>
        <div className="px-3 pb-3">
          <BlendModePanel />
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 text-xs text-muted-foreground"
        onClick={() => resetFilters()}
      >
        <RotateCcw className="size-3" />
        Reset All Filters
      </Button>
    </div>
  );
}

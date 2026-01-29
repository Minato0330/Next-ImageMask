"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatedTabIndicator } from "@/components/ui/animated-tab-indicator";
import { useStudioStore } from "@/hooks/use-studio-store";
import { PRESETS } from "@/lib/presets/preset-definitions";
import type { Preset } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "mask", label: "Mask" },
  { key: "filter", label: "Filter" },
  { key: "clip", label: "Clip" },
  { key: "combined", label: "Combined" },
] as const;

export function PresetPanel() {
  const applyPresetAction = useStudioStore((s) => s.applyPreset);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = PRESETS.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const applyPreset = (preset: Preset) => {
    applyPresetAction(preset.apply);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search presets..."
          className="h-8 pl-8 text-xs"
        />
      </div>

      <div className="flex gap-0.5 rounded-lg bg-muted/50 p-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={cn(
              "relative flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
              category === cat.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setCategory(cat.key)}
          >
            {category === cat.key && (
              <AnimatedTabIndicator
                layoutId="preset-category-indicator"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {filtered.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="group rounded-lg border border-border/50 bg-card/30 p-2.5 text-left transition-all hover:border-foreground/10 hover:bg-muted/50 hover:shadow-sm active:scale-[0.98]"
            onClick={() => applyPreset(preset)}
          >
            <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground">
              {preset.name}
            </span>
            <p className="mt-1 text-[10px] leading-snug text-muted-foreground/70">
              {preset.description}
            </p>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-xs text-muted-foreground">
          No presets found
        </p>
      )}
    </div>
  );
}

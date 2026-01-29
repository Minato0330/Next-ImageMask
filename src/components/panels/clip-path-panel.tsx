"use client";

import {
  Circle,
  RectangleHorizontal,
  Pentagon,
  Code,
  Ban,
} from "lucide-react";
import { LabeledSlider } from "@/components/shared/labeled-slider";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStudioStore } from "@/hooks/use-studio-store";
import { POLYGON_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ClipPath } from "@/lib/types";

const SHAPE_OPTIONS = [
  { value: "none", label: "None", icon: Ban },
  { value: "circle", label: "Circle", icon: Circle },
  { value: "ellipse", label: "Ellipse", icon: Circle },
  { value: "inset", label: "Inset", icon: RectangleHorizontal },
  { value: "polygon", label: "Polygon", icon: Pentagon },
  { value: "custom", label: "Custom", icon: Code },
] as const;

export function ClipPathPanel() {
  const clipPath = useStudioStore((s) => s.clipPath);
  const setClipPathAction = useStudioStore((s) => s.setClipPath);

  const setClipPath = (cp: ClipPath) => {
    setClipPathAction(cp);
  };

  const handleTypeChange = (type: string) => {
    if (!type || type === clipPath.type) return;
    switch (type) {
      case "none":
        setClipPath({ type: "none" });
        break;
      case "circle":
        setClipPath({ type: "circle", radius: 50, centerX: 50, centerY: 50 });
        break;
      case "ellipse":
        setClipPath({ type: "ellipse", radiusX: 50, radiusY: 40, centerX: 50, centerY: 50 });
        break;
      case "inset":
        setClipPath({ type: "inset", top: 5, right: 5, bottom: 5, left: 5, borderRadius: 0 });
        break;
      case "polygon":
        setClipPath({ type: "polygon", points: POLYGON_PRESETS.triangle, preset: "triangle" });
        break;
      case "custom":
        setClipPath({ type: "custom", value: "" });
        break;
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border border-border/50 bg-card/30">
        <div className="px-3 py-2.5">
          <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">Shape Type</span>
        </div>
        <div className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-1.5">
            {SHAPE_OPTIONS.map((shape) => {
              const Icon = shape.icon;
              const isActive = clipPath.type === shape.value;
              return (
                <button
                  key={shape.value}
                  type="button"
                  onClick={() => handleTypeChange(shape.value)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-[11px] font-medium transition-colors",
                    isActive
                      ? "border-foreground/20 bg-foreground/5 text-foreground shadow-sm"
                      : "border-border/50 bg-transparent text-muted-foreground hover:border-foreground/10 hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                  {shape.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {clipPath.type === "circle" && (
        <div className="rounded-lg border border-border/50 bg-card/30">
          <div className="px-3 py-2.5">
            <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">Circle</span>
          </div>
          <div className="px-3 pb-3 space-y-3">
            <LabeledSlider
              label="Radius"
              value={clipPath.radius}
              min={0}
              max={100}
              unit="%"
              onChange={(radius) => setClipPath({ ...clipPath, radius })}
            />
            <LabeledSlider
              label="Center X"
              value={clipPath.centerX}
              min={0}
              max={100}
              unit="%"
              onChange={(centerX) => setClipPath({ ...clipPath, centerX })}
            />
            <LabeledSlider
              label="Center Y"
              value={clipPath.centerY}
              min={0}
              max={100}
              unit="%"
              onChange={(centerY) => setClipPath({ ...clipPath, centerY })}
            />
          </div>
        </div>
      )}

      {clipPath.type === "ellipse" && (
        <div className="rounded-lg border border-border/50 bg-card/30">
          <div className="px-3 py-2.5">
            <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">Ellipse</span>
          </div>
          <div className="px-3 pb-3 space-y-3">
            <LabeledSlider
              label="Radius X"
              value={clipPath.radiusX}
              min={0}
              max={100}
              unit="%"
              onChange={(radiusX) => setClipPath({ ...clipPath, radiusX })}
            />
            <LabeledSlider
              label="Radius Y"
              value={clipPath.radiusY}
              min={0}
              max={100}
              unit="%"
              onChange={(radiusY) => setClipPath({ ...clipPath, radiusY })}
            />
            <LabeledSlider
              label="Center X"
              value={clipPath.centerX}
              min={0}
              max={100}
              unit="%"
              onChange={(centerX) => setClipPath({ ...clipPath, centerX })}
            />
            <LabeledSlider
              label="Center Y"
              value={clipPath.centerY}
              min={0}
              max={100}
              unit="%"
              onChange={(centerY) => setClipPath({ ...clipPath, centerY })}
            />
          </div>
        </div>
      )}

      {clipPath.type === "inset" && (
        <div className="rounded-lg border border-border/50 bg-card/30">
          <div className="px-3 py-2.5">
            <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">Inset</span>
          </div>
          <div className="px-3 pb-3 space-y-3">
            <LabeledSlider
              label="Top"
              value={clipPath.top}
              min={0}
              max={50}
              unit="%"
              onChange={(top) => setClipPath({ ...clipPath, top })}
            />
            <LabeledSlider
              label="Right"
              value={clipPath.right}
              min={0}
              max={50}
              unit="%"
              onChange={(right) => setClipPath({ ...clipPath, right })}
            />
            <LabeledSlider
              label="Bottom"
              value={clipPath.bottom}
              min={0}
              max={50}
              unit="%"
              onChange={(bottom) => setClipPath({ ...clipPath, bottom })}
            />
            <LabeledSlider
              label="Left"
              value={clipPath.left}
              min={0}
              max={50}
              unit="%"
              onChange={(left) => setClipPath({ ...clipPath, left })}
            />
            <LabeledSlider
              label="Radius"
              value={clipPath.borderRadius}
              min={0}
              max={50}
              unit="%"
              onChange={(borderRadius) => setClipPath({ ...clipPath, borderRadius })}
            />
          </div>
        </div>
      )}

      {clipPath.type === "polygon" && (
        <div className="rounded-lg border border-border/50 bg-card/30">
          <div className="px-3 py-2.5">
            <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">Polygon Presets</span>
          </div>
          <div className="px-3 pb-3">
            <div className="grid grid-cols-3 gap-1.5">
              {Object.keys(POLYGON_PRESETS).map((preset) => (
                <Button
                  key={preset}
                  variant={clipPath.preset === preset ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs capitalize"
                  onClick={() =>
                    setClipPath({
                      type: "polygon",
                      points: POLYGON_PRESETS[preset],
                      preset,
                    })
                  }
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {clipPath.type === "custom" && (
        <div className="rounded-lg border border-border/50 bg-card/30">
          <div className="px-3 py-2.5">
            <span className="tracking-wide uppercase text-[10px] font-semibold text-muted-foreground">Custom Value</span>
          </div>
          <div className="px-3 pb-3 space-y-2">
            <span className="text-[11px] text-muted-foreground">
              CSS clip-path value
            </span>
            <Input
              value={clipPath.value}
              onChange={(e) => setClipPath({ ...clipPath, value: e.target.value })}
              placeholder="circle(50% at 50% 50%)"
              className="h-8 font-mono text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}

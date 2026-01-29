"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeftRight, AlignHorizontalSpaceAround, Shuffle } from "lucide-react";
import type {
  MaskImage,
  LinearGradient,
  RadialGradient,
  ConicGradient,
  GradientStop,
} from "@/lib/types";
import { LabeledSelect } from "@/components/shared/labeled-select";
import { AngleInput } from "@/components/shared/angle-input";
import { LabeledSlider } from "@/components/shared/labeled-slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { GradientPreviewBar } from "./gradient-preview-bar";
import { GradientStopEditor } from "./gradient-stop-editor";
import {
  GRADIENT_TYPE_OPTIONS,
  RADIAL_SHAPE_OPTIONS,
  RADIAL_SIZE_OPTIONS,
} from "@/lib/constants";
import { generateId } from "@/lib/store/initial-state";
import { interpolateAtPosition } from "@/lib/gradient/color-utils";

interface GradientBuilderProps {
  gradient: LinearGradient | RadialGradient | ConicGradient;
  onChange: (gradient: MaskImage) => void;
}

export function GradientBuilder({ gradient, onChange }: GradientBuilderProps) {
  const stops = gradient.stops;
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  // Reset selection when gradient identity changes or selected stop is removed
  useEffect(() => {
    if (selectedStopId && !stops.find((s) => s.id === selectedStopId)) {
      setSelectedStopId(null);
    }
  }, [stops, selectedStopId]);

  const handleTypeChange = (type: string) => {
    const baseStops = gradient.stops;
    if (type === "linear-gradient") {
      onChange({
        type: "linear-gradient",
        angle: 180,
        stops: baseStops,
        repeating: gradient.repeating,
      });
    } else if (type === "radial-gradient") {
      onChange({
        type: "radial-gradient",
        shape: "circle",
        sizeKeyword: "farthest-corner",
        centerX: 50,
        centerY: 50,
        stops: baseStops,
        repeating: gradient.repeating,
      });
    } else if (type === "conic-gradient") {
      onChange({
        type: "conic-gradient",
        fromAngle: 0,
        centerX: 50,
        centerY: 50,
        stops: baseStops,
        repeating: gradient.repeating,
      });
    } else if (type === "url") {
      onChange({ type: "url", url: "" });
    }
  };

  const updateStop = useCallback(
    (id: string, changes: Partial<GradientStop>) => {
      const newStops = stops.map((s) => (s.id === id ? { ...s, ...changes } : s));
      onChange({ ...gradient, stops: newStops } as MaskImage);
    },
    [stops, gradient, onChange]
  );

  const addStop = useCallback(
    (position: number) => {
      const interpolated = interpolateAtPosition(stops, position);
      const newStop: GradientStop = {
        id: generateId(),
        color: interpolated.color,
        position,
        opacity: interpolated.opacity,
      };
      onChange({ ...gradient, stops: [...stops, newStop] } as MaskImage);
      setSelectedStopId(newStop.id);
    },
    [stops, gradient, onChange]
  );

  const removeStop = useCallback(
    (id: string) => {
      if (stops.length <= 2) return;
      if (selectedStopId === id) setSelectedStopId(null);
      onChange({ ...gradient, stops: stops.filter((s) => s.id !== id) } as MaskImage);
    },
    [stops, gradient, onChange, selectedStopId]
  );

  const selectStop = useCallback((id: string) => {
    setSelectedStopId(id);
  }, []);

  // --- Utility actions ---

  const reversePositions = useCallback(() => {
    const newStops = stops.map((s) => ({ ...s, position: 100 - s.position }));
    onChange({ ...gradient, stops: newStops } as MaskImage);
  }, [stops, gradient, onChange]);

  const distributeEvenly = useCallback(() => {
    const sorted = stops.slice().sort((a, b) => a.position - b.position);
    const newStops = sorted.map((s, i) => ({
      ...s,
      position: sorted.length === 1 ? 50 : Math.round((i / (sorted.length - 1)) * 100),
    }));
    onChange({ ...gradient, stops: newStops } as MaskImage);
  }, [stops, gradient, onChange]);

  const flipColors = useCallback(() => {
    const sorted = stops.slice().sort((a, b) => a.position - b.position);
    const colors = sorted.map((s) => ({ color: s.color, opacity: s.opacity }));
    const reversed = colors.slice().reverse();
    const newStops = sorted.map((s, i) => ({
      ...s,
      color: reversed[i].color,
      opacity: reversed[i].opacity,
    }));
    onChange({ ...gradient, stops: newStops } as MaskImage);
  }, [stops, gradient, onChange]);

  // Sorted stops for display
  const sortedStops = useMemo(
    () => stops.slice().sort((a, b) => a.position - b.position),
    [stops]
  );

  // Sibling swatch colors for the color picker
  const swatchColors = useMemo(
    () => stops.map((s) => s.color).filter((c) => c.startsWith("#")),
    [stops]
  );

  return (
    <div className="space-y-2.5">
      <LabeledSelect
        label="Type"
        value={gradient.type}
        options={[...GRADIENT_TYPE_OPTIONS, "url"]}
        onChange={handleTypeChange}
      />

      <div className="flex items-center gap-3">
        <span className="w-16 shrink-0 text-[13px] text-muted-foreground">Repeat</span>
        <Switch
          checked={gradient.repeating}
          onCheckedChange={(checked) =>
            onChange({ ...gradient, repeating: checked } as MaskImage)
          }
        />
        <Label className="text-xs text-muted-foreground">Repeating</Label>
      </div>

      {gradient.type === "linear-gradient" && (
        <AngleInput
          label="Angle"
          value={gradient.angle}
          onChange={(angle) => onChange({ ...gradient, angle })}
        />
      )}

      {gradient.type === "radial-gradient" && (
        <div className="space-y-2.5">
          <LabeledSelect
            label="Shape"
            value={gradient.shape}
            options={RADIAL_SHAPE_OPTIONS}
            onChange={(shape) =>
              onChange({ ...gradient, shape } as RadialGradient)
            }
          />
          <LabeledSelect
            label="Size"
            value={gradient.sizeKeyword}
            options={RADIAL_SIZE_OPTIONS}
            onChange={(sizeKeyword) =>
              onChange({ ...gradient, sizeKeyword } as RadialGradient)
            }
          />
          <LabeledSlider
            label="Center X"
            value={gradient.centerX}
            min={0}
            max={100}
            unit="%"
            onChange={(centerX) => onChange({ ...gradient, centerX } as RadialGradient)}
          />
          <LabeledSlider
            label="Center Y"
            value={gradient.centerY}
            min={0}
            max={100}
            unit="%"
            onChange={(centerY) => onChange({ ...gradient, centerY } as RadialGradient)}
          />
        </div>
      )}

      {gradient.type === "conic-gradient" && (
        <div className="space-y-2.5">
          <AngleInput
            label="From"
            value={gradient.fromAngle}
            onChange={(fromAngle) =>
              onChange({ ...gradient, fromAngle } as ConicGradient)
            }
          />
          <LabeledSlider
            label="Center X"
            value={gradient.centerX}
            min={0}
            max={100}
            unit="%"
            onChange={(centerX) => onChange({ ...gradient, centerX } as ConicGradient)}
          />
          <LabeledSlider
            label="Center Y"
            value={gradient.centerY}
            min={0}
            max={100}
            unit="%"
            onChange={(centerY) => onChange({ ...gradient, centerY } as ConicGradient)}
          />
        </div>
      )}

      <GradientPreviewBar
        gradient={gradient}
        selectedStopId={selectedStopId}
        onAddStop={addStop}
        onUpdateStop={updateStop}
        onSelectStop={selectStop}
        onDeleteStop={removeStop}
      />

      {/* Utility toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Stops ({stops.length})
        </span>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={reversePositions}
              >
                <ArrowLeftRight className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reverse positions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={distributeEvenly}
              >
                <AlignHorizontalSpaceAround className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Distribute evenly</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={flipColors}
              >
                <Shuffle className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Flip colors</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Stop editors with layout animation */}
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {sortedStops.map((stop) => (
            <motion.div
              key={stop.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <GradientStopEditor
                stop={stop}
                isSelected={stop.id === selectedStopId}
                canDelete={stops.length > 2}
                swatchColors={swatchColors}
                onUpdate={(changes) => updateStop(stop.id, changes)}
                onDelete={() => removeStop(stop.id)}
                onSelect={() => selectStop(stop.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

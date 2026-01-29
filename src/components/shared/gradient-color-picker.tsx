"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  hexToHsl,
  hslToHex,
  isValidHex,
} from "@/lib/gradient/color-utils";

interface GradientColorPickerProps {
  color: string;
  opacity?: number;
  onChange: (color: string) => void;
  onOpacityChange?: (opacity: number) => void;
  swatchColors?: string[];
}

const DEFAULT_SWATCHES = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
];

const SL_WIDTH = 200;
const SL_HEIGHT = 150;

export function GradientColorPicker({
  color,
  opacity = 1,
  onChange,
  onOpacityChange,
  swatchColors = [],
}: GradientColorPickerProps) {
  const hsl = hexToHsl(color.startsWith("#") ? color : "#000000");
  const [hue, setHue] = useState(hsl.h * 360);
  const [sat, setSat] = useState(hsl.s);
  const [lit, setLit] = useState(hsl.l);
  const [hexInput, setHexInput] = useState(color);
  const [hexValid, setHexValid] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slDragging = useRef(false);

  // Sync external color prop -> internal HSL state
  useEffect(() => {
    const parsed = hexToHsl(color.startsWith("#") ? color : "#000000");
    setHue(parsed.h * 360);
    setSat(parsed.s);
    setLit(parsed.l);
    setHexInput(color);
    setHexValid(true);
  }, [color]);

  // Draw the SL gradient onto the canvas
  const drawCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      const hueColor = hslToHex(hue / 360, 1, 0.5);
      const gradH = ctx.createLinearGradient(0, 0, w, 0);
      gradH.addColorStop(0, "#ffffff");
      gradH.addColorStop(1, hueColor);
      ctx.fillStyle = gradH;
      ctx.fillRect(0, 0, w, h);

      const gradV = ctx.createLinearGradient(0, 0, 0, h);
      gradV.addColorStop(0, "rgba(0,0,0,0)");
      gradV.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = gradV;
      ctx.fillRect(0, 0, w, h);
    },
    [hue]
  );

  // Callback ref: stores element for imperative access AND draws immediately
  const setCanvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      canvasRef.current = node;
      if (node) drawCanvas(node);
    },
    [drawCanvas]
  );

  const pickFromCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      // Convert canvas x,y to saturation,lightness
      // x=0 is white (s=0, l=1), x=1 is pure hue (s=1, l=0.5), y=1 is black (l=0)
      const s = x;
      const l = (1 - y) * (1 - x / 2);
      setSat(s);
      setLit(l);
      const hex = hslToHex(hue / 360, s, Math.max(0.001, l));
      setHexInput(hex);
      setHexValid(true);
      onChange(hex);
    },
    [hue, onChange]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      slDragging.current = true;
      pickFromCanvas(e.clientX, e.clientY);

      const handleMove = (me: MouseEvent) => {
        if (!slDragging.current) return;
        pickFromCanvas(me.clientX, me.clientY);
      };
      const handleUp = () => {
        slDragging.current = false;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [pickFromCanvas]
  );

  const handleHueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const h = Number(e.target.value);
      setHue(h);
      const hex = hslToHex(h / 360, sat, Math.max(0.001, lit));
      setHexInput(hex);
      setHexValid(true);
      onChange(hex);
    },
    [sat, lit, onChange]
  );

  const handleOpacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onOpacityChange?.(Number(e.target.value) / 100);
    },
    [onOpacityChange]
  );

  const handleHexInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (!val.startsWith("#")) val = `#${val}`;
      setHexInput(val);
      if (isValidHex(val)) {
        setHexValid(true);
        onChange(val);
      } else {
        setHexValid(false);
      }
    },
    [onChange]
  );

  // Compute SL cursor position from current sat/lit
  const cursorX = sat;
  const cursorY = lit > 0 ? 1 - lit / (1 - sat / 2) : 1;

  const allSwatches = [
    ...DEFAULT_SWATCHES,
    ...swatchColors.filter((c) => !DEFAULT_SWATCHES.includes(c)),
  ].slice(0, 12);

  const safeColor = color.startsWith("#") ? color : "#000000";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative h-6 w-6 shrink-0 cursor-pointer overflow-hidden rounded border border-border/50 hover:shadow-sm"
        >
          {/* Checkerboard behind for transparency */}
          <span
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(45deg, var(--checkerboard-color, #e5e5e5) 25%, transparent 25%), linear-gradient(-45deg, var(--checkerboard-color, #e5e5e5) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--checkerboard-color, #e5e5e5) 75%), linear-gradient(-45deg, transparent 75%, var(--checkerboard-color, #e5e5e5) 75%)",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
            }}
          />
          <span
            className="absolute inset-0"
            style={{ backgroundColor: safeColor, opacity }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-3 space-y-2.5"
        align="start"
        sideOffset={6}
      >
        {/* SL Canvas */}
        <div className="relative" style={{ width: SL_WIDTH, height: SL_HEIGHT }}>
          <canvas
            ref={setCanvasRef}
            width={SL_WIDTH}
            height={SL_HEIGHT}
            className="block cursor-crosshair rounded"
            onMouseDown={handleCanvasMouseDown}
          />
          {/* Cursor indicator */}
          <div
            className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
            style={{
              left: `${Math.max(0, Math.min(1, cursorX)) * 100}%`,
              top: `${Math.max(0, Math.min(1, cursorY)) * 100}%`,
              boxShadow: "0 0 0 1px var(--border-strong)",
            }}
          />
        </div>

        {/* Hue strip */}
        <div>
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={handleHueChange}
            className="hue-strip h-3 w-full cursor-pointer appearance-none rounded-full"
          />
        </div>

        {/* Opacity strip (only when onOpacityChange is provided) */}
        {onOpacityChange && (
          <div className="relative h-3 w-full overflow-hidden rounded-full">
            <span
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, var(--checkerboard-color, #e5e5e5) 25%, transparent 25%), linear-gradient(-45deg, var(--checkerboard-color, #e5e5e5) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--checkerboard-color, #e5e5e5) 75%), linear-gradient(-45deg, transparent 75%, var(--checkerboard-color, #e5e5e5) 75%)",
                backgroundSize: "8px 8px",
                backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
              }}
            />
            <span
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${safeColor})`,
              }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(opacity * 100)}
              onChange={handleOpacityChange}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
              style={{ opacity: 0 }}
            />
            {/* Visible thumb indicator */}
            <div
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              style={{
                left: `${opacity * 100}%`,
                boxShadow: "0 0 0 1px var(--border-strong)",
              }}
            />
          </div>
        )}

        {/* Hex input + opacity readout */}
        <div className="flex items-center gap-2">
          <Input
            value={hexInput}
            onChange={handleHexInputChange}
            className={`h-7 w-[7.5rem] font-mono text-xs ${!hexValid ? "border-destructive" : ""}`}
            maxLength={7}
          />
          {onOpacityChange && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {Math.round(opacity * 100)}%
            </span>
          )}
        </div>

        {/* Quick swatches */}
        <div className="flex flex-wrap gap-1" style={{ maxWidth: SL_WIDTH }}>
          {allSwatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className="h-5 w-5 rounded-sm border border-border/50 transition-transform hover:scale-110"
              style={{ backgroundColor: swatch }}
              onClick={() => {
                onChange(swatch);
                setHexInput(swatch);
                setHexValid(true);
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

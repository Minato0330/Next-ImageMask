"use client";

import { useCallback, useRef, useState } from "react";
import type {
  LinearGradient,
  RadialGradient,
  ConicGradient,
  GradientStop,
} from "@/lib/types";
import { interpolateAtPosition, contrastingColor } from "@/lib/gradient/color-utils";

interface GradientPreviewBarProps {
  gradient: LinearGradient | RadialGradient | ConicGradient;
  selectedStopId: string | null;
  onAddStop: (position: number) => void;
  onUpdateStop: (id: string, changes: Partial<GradientStop>) => void;
  onSelectStop: (id: string) => void;
  onDeleteStop: (id: string) => void;
}

export function GradientPreviewBar({
  gradient,
  selectedStopId,
  onAddStop,
  onUpdateStop,
  onSelectStop,
  onDeleteStop,
}: GradientPreviewBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<string | null>(null);
  const [dragPos, setDragPos] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<number | null>(null);
  const [hoverOnHandle, setHoverOnHandle] = useState(false);

  const previewGradient = `linear-gradient(90deg, ${gradient.stops
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => {
      if (s.opacity >= 1) return `${s.color} ${s.position}%`;
      if (s.color.startsWith("#")) {
        const r = parseInt(s.color.slice(1, 3), 16);
        const g = parseInt(s.color.slice(3, 5), 16);
        const b = parseInt(s.color.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${s.opacity}) ${s.position}%`;
      }
      return `${s.color} ${s.position}%`;
    })
    .join(", ")})`;

  const getPositionFromEvent = useCallback(
    (clientX: number): number => {
      if (!barRef.current) return 50;
      const rect = barRef.current.getBoundingClientRect();
      return Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    },
    []
  );

  const handleBarClick = useCallback(
    (e: React.MouseEvent) => {
      if (draggingRef.current) return;
      const position = getPositionFromEvent(e.clientX);
      onAddStop(position);
    },
    [onAddStop, getPositionFromEvent]
  );

  const handleStopMouseDown = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectStop(id);
      draggingRef.current = id;
      const stop = gradient.stops.find((s) => s.id === id);
      if (stop) setDragPos(stop.position);

      document.body.style.cursor = "grabbing";

      const handleMouseMove = (me: MouseEvent) => {
        if (!draggingRef.current) return;
        const position = getPositionFromEvent(me.clientX);
        setDragPos(position);
        onUpdateStop(draggingRef.current, { position });
      };

      const handleMouseUp = () => {
        draggingRef.current = null;
        setDragPos(null);
        document.body.style.cursor = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onUpdateStop, onSelectStop, getPositionFromEvent, gradient.stops]
  );

  const handleBarMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggingRef.current || hoverOnHandle) {
        setHoverPos(null);
        return;
      }
      setHoverPos(getPositionFromEvent(e.clientX));
    },
    [getPositionFromEvent, hoverOnHandle]
  );

  const handleBarMouseLeave = useCallback(() => {
    setHoverPos(null);
  }, []);

  const handleKeyDown = useCallback(
    (id: string) => (e: React.KeyboardEvent) => {
      const stop = gradient.stops.find((s) => s.id === id);
      if (!stop) return;
      const step = e.shiftKey ? 10 : 1;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onUpdateStop(id, { position: Math.max(0, stop.position - step) });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onUpdateStop(id, { position: Math.min(100, stop.position + step) });
      } else if ((e.key === "Delete" || e.key === "Backspace") && gradient.stops.length > 2) {
        e.preventDefault();
        onDeleteStop(id);
      }
    },
    [gradient.stops, onUpdateStop, onDeleteStop]
  );

  const hoverInterp =
    hoverPos !== null ? interpolateAtPosition(gradient.stops, hoverPos) : null;

  return (
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">Preview</span>
      {/* Bar container */}
      <div className="relative pb-5">
        <div
          ref={barRef}
          className="relative h-8 cursor-crosshair overflow-hidden rounded-md border border-border/50"
          onClick={handleBarClick}
          onMouseMove={handleBarMouseMove}
          onMouseLeave={handleBarMouseLeave}
        >
          {/* Checkerboard background */}
          <span
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(45deg, var(--checkerboard-color, #e5e5e5) 25%, transparent 25%), linear-gradient(-45deg, var(--checkerboard-color, #e5e5e5) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--checkerboard-color, #e5e5e5) 75%), linear-gradient(-45deg, transparent 75%, var(--checkerboard-color, #e5e5e5) 75%)",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
              opacity: 0.4,
            }}
          />
          {/* Gradient overlay */}
          <span className="absolute inset-0" style={{ background: previewGradient }} />

          {/* Ghost hover preview */}
          {hoverPos !== null && !draggingRef.current && hoverInterp && (
            <div
              className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${hoverPos}%` }}
            >
              <div
                className="h-4 w-4 rounded-full border-2 opacity-60"
                style={{
                  backgroundColor: hoverInterp.color,
                  borderColor: contrastingColor(hoverInterp.color),
                }}
              />
            </div>
          )}
        </div>

        {/* Stop handles - positioned below the bar */}
        {gradient.stops.map((stop) => {
          const isSelected = stop.id === selectedStopId;
          const isDragging = draggingRef.current === stop.id;
          const displayPos = isDragging && dragPos !== null ? dragPos : stop.position;
          const border = contrastingColor(stop.color);

          return (
            <div
              key={stop.id}
              className="absolute"
              style={{
                left: `${displayPos}%`,
                top: "24px",
                transform: "translateX(-50%)",
                zIndex: isDragging ? 20 : isSelected ? 10 : 1,
              }}
            >
              {/* Triangle pointer */}
              <div
                className="mx-auto h-0 w-0"
                style={{
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderBottom: `5px solid ${isSelected ? "var(--primary)" : "var(--foreground)"}`,
                  opacity: isSelected ? 1 : 0.4,
                }}
              />
              {/* Circle handle */}
              <div
                role="slider"
                tabIndex={0}
                aria-valuenow={stop.position}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Stop at ${stop.position}%`}
                className={`
                  h-4 w-4 rounded-full cursor-grab transition-transform
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  ${isDragging ? "cursor-grabbing scale-[1.3]" : ""}
                  ${isSelected && !isDragging ? "scale-125" : ""}
                `}
                style={{
                  backgroundColor: stop.color,
                  border: `2px solid ${isSelected ? "var(--primary)" : border}`,
                  boxShadow: isSelected
                    ? "0 0 0 3px color-mix(in oklch, var(--primary) 30%, transparent)"
                    : "var(--shadow-xs)",
                }}
                onMouseDown={handleStopMouseDown(stop.id)}
                onMouseEnter={() => setHoverOnHandle(true)}
                onMouseLeave={() => setHoverOnHandle(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStop(stop.id);
                }}
                onKeyDown={handleKeyDown(stop.id)}
              />

              {/* Position tooltip during drag */}
              {isDragging && dragPos !== null && (
                <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-mono text-background whitespace-nowrap">
                  {dragPos}%
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground/50">
        Click to add · Drag to move · Arrow keys to nudge
      </p>
    </div>
  );
}

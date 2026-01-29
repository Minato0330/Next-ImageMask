"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { AnimatedCollapse } from "@/components/ui/animated-collapse";
import { AnimatedRotate } from "@/components/ui/animated-rotate";

interface PanelSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  actions?: ReactNode;
}

export function PanelSection({
  title,
  children,
  defaultOpen = true,
  actions,
}: PanelSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div data-slot="panel-section" className="rounded-lg border border-border/50 bg-card/30">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <AnimatedRotate rotate={open ? 90 : 0}>
            <ChevronRight className="size-3" />
          </AnimatedRotate>
          <span className="tracking-wide uppercase text-[10px] font-semibold">{title}</span>
        </div>
        {actions && (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </button>
      <AnimatedCollapse open={open} className="px-3 pb-3">
        {children}
      </AnimatedCollapse>
    </div>
  );
}

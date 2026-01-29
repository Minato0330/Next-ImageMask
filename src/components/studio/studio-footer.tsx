"use client";

import { ChevronUp, ChevronDown, Code2 } from "lucide-react";
import { useStudioStore } from "@/hooks/use-studio-store";
import { CssOutputPanel } from "@/components/code/css-output-panel";

export function StudioFooter() {
  const expanded = useStudioStore((s) => s.ui.cssOutputExpanded);
  const toggleCssOutput = useStudioStore((s) => s.toggleCssOutput);

  return (
    <div
      data-slot="studio-footer"
      className={`shrink-0 border-t border-border/50 bg-background transition-[height] duration-200 ${
        expanded ? "h-[220px]" : "h-10"
      }`}
    >
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between px-4 transition-colors hover:bg-muted/50"
        onClick={() => toggleCssOutput()}
      >
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">CSS Output</span>
        </div>
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {expanded && (
        <div className="h-[calc(220px-2.5rem)] overflow-hidden">
          <CssOutputPanel />
        </div>
      )}
    </div>
  );
}

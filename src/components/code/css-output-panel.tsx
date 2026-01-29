"use client";

import { useCallback } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatedTabIndicator } from "@/components/ui/animated-tab-indicator";
import { CopyButton } from "./copy-button";
import { useCssGenerator } from "@/hooks/use-css-generator";
import { useStudioStore } from "@/hooks/use-studio-store";
import type { CssOutputTab } from "@/lib/types";

const tabs = [
  { value: "full" as const, label: "Full CSS" },
  { value: "mask" as const, label: "Mask" },
  { value: "filter" as const, label: "Filter" },
  { value: "clip" as const, label: "Clip Path" },
];

export function CssOutputPanel() {
  const cssOutputTab = useStudioStore((s) => s.ui.cssOutputTab);
  const setCssOutputTab = useStudioStore((s) => s.setCssOutputTab);
  const { fullCss, maskCss, filterCss, clipCss } = useCssGenerator();

  const getCssForTab = useCallback(
    (tab: CssOutputTab) => {
      switch (tab) {
        case "full": return fullCss;
        case "mask": return maskCss;
        case "filter": return filterCss;
        case "clip": return clipCss;
      }
    },
    [fullCss, maskCss, filterCss, clipCss]
  );

  return (
    <div className="flex h-full flex-col">
      <TabsPrimitive.Root
        value={cssOutputTab}
        onValueChange={(v) => setCssOutputTab(v as CssOutputTab)}
        className="flex h-full flex-col"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-4">
          <TabsPrimitive.List className="relative flex h-9 items-end gap-1">
            {tabs.map((tab) => {
              const isActive = cssOutputTab === tab.value;
              return (
                <TabsPrimitive.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="relative cursor-pointer px-2.5 pb-2.5 pt-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none data-[state=active]:text-foreground"
                >
                  <span className={`transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-60"}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <AnimatedTabIndicator
                      layoutId="code-tab-indicator"
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-foreground"
                    />
                  )}
                </TabsPrimitive.Trigger>
              );
            })}
          </TabsPrimitive.List>
          <CopyButton text={getCssForTab(cssOutputTab)} />
        </div>

        <ScrollArea className="flex-1">
          <CodeBlock code={getCssForTab(cssOutputTab)} />
        </ScrollArea>
      </TabsPrimitive.Root>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-[var(--surface-sunken)] p-4 font-mono text-xs leading-relaxed text-foreground/70">
      {code}
    </pre>
  );
}

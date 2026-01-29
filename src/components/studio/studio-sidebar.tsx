"use client";

import { Layers, Sliders, Scissors, Sparkles } from "lucide-react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatedTabIndicator } from "@/components/ui/animated-tab-indicator";
import { useStudioStore } from "@/hooks/use-studio-store";
import { ImageUploadPanel } from "@/components/panels/image-upload-panel";
import { MaskLayersPanel } from "@/components/panels/mask-layers-panel";
import { FilterPanel } from "@/components/panels/filter-panel";
import { ClipPathPanel } from "@/components/panels/clip-path-panel";
import { PresetPanel } from "@/components/panels/preset-panel";
import type { SidebarPanel } from "@/lib/types";

const tabs = [
  { value: "masks" as const, label: "Masks", icon: Layers },
  { value: "filters" as const, label: "Filters", icon: Sliders },
  { value: "clip" as const, label: "Clip", icon: Scissors },
  { value: "presets" as const, label: "Presets", icon: Sparkles },
];

const panelComponents: Record<SidebarPanel, React.ComponentType> = {
  masks: MaskLayersPanel,
  filters: FilterPanel,
  clip: ClipPathPanel,
  presets: PresetPanel,
};

export function StudioSidebar() {
  const activePanel = useStudioStore((s) => s.ui.activePanel);
  const setActivePanel = useStudioStore((s) => s.setActivePanel);

  const ActivePanelComponent = panelComponents[activePanel];

  return (
    <div data-slot="studio-sidebar" className="flex h-full flex-col border-r border-border/50 bg-background">
      <div className="border-b border-border/50 px-3 py-2.5">
        <ImageUploadPanel />
      </div>
      <TabsPrimitive.Root
        value={activePanel}
        onValueChange={(v) => setActivePanel(v as SidebarPanel)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="border-b border-border/50 px-3">
          <TabsPrimitive.List className="relative flex h-10 items-end gap-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activePanel === tab.value;
              return (
                <TabsPrimitive.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="relative flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-t-md px-2 pb-2.5 pt-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none data-[state=active]:text-foreground"
                >
                  <span className={`flex items-center gap-1.5 transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-60"}`}>
                    <Icon className="size-3.5" />
                    {tab.label}
                  </span>
                  {isActive && (
                    <AnimatedTabIndicator
                      layoutId="sidebar-tab-indicator"
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-foreground"
                    />
                  )}
                </TabsPrimitive.Trigger>
              );
            })}
          </TabsPrimitive.List>
        </div>

        <ScrollArea className="flex-1 overflow-hidden [&_[data-slot=scroll-area-scrollbar]]:hidden">
          <div className="p-3">
            <ActivePanelComponent />
          </div>
        </ScrollArea>
      </TabsPrimitive.Root>
    </div>
  );
}

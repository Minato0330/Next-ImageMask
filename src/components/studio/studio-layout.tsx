"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { StudioHeader } from "./studio-header";
import { StudioSidebar } from "./studio-sidebar";
import { StudioCanvas } from "./studio-canvas";
import { StudioFooter } from "./studio-footer";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function StudioLayout() {
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <StudioHeader />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          defaultSize={22}
          minSize={16}
          maxSize={35}
          className="flex flex-col"
        >
          <StudioSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={78} minSize={50}>
          <div className="flex h-full flex-col overflow-hidden">
            <StudioCanvas />
            <StudioFooter />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

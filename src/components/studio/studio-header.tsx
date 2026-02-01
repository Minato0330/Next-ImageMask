"use client";

import { useTheme } from "next-themes";
import { Undo2, Redo2, Download, Copy, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStudioStore } from "@/hooks/use-studio-store";
import { useClipboard } from "@/hooks/use-clipboard";
import { useCssGenerator } from "@/hooks/use-css-generator";
import { usePlatform } from "@/hooks/use-platform";
import { useState, useEffect } from "react";
import { Socials } from "@/components/socials";

function TooltipButton({
  icon: Icon,
  tooltip,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Toggle theme</TooltipContent>
    </Tooltip>
  );
}

export function StudioHeader() {
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const canUndo = useStudioStore((s) => s._history.past.length > 0);
  const canRedo = useStudioStore((s) => s._history.future.length > 0);
  const openExportDialog = useStudioStore((s) => s.openExportDialog);
  const { copy } = useClipboard();
  const { fullCss } = useCssGenerator();
  const { formatShortcut } = usePlatform();

  return (
    <header
      data-slot="studio-header"
      className="flex h-12 shrink-0 items-center justify-between border-b border-border/50 bg-background px-4"
    >
      <span className="font-mono text-lg font-semibold tracking-tight text-foreground">
        maskit
      </span>

      <div className="flex items-center gap-0.5">
        <TooltipProvider delayDuration={300}>
          <TooltipButton
            icon={Undo2}
            tooltip={`Undo (${formatShortcut("Z")})`}
            onClick={undo}
            disabled={!canUndo}
          />
          <TooltipButton
            icon={Redo2}
            tooltip={`Redo (${formatShortcut("Shift", "Z")})`}
            onClick={redo}
            disabled={!canRedo}
          />

          <Separator orientation="vertical" className="mx-1.5 h-4" />

          <TooltipButton
            icon={Copy}
            tooltip={`Copy CSS (${formatShortcut("Shift", "C")})`}
            onClick={() => copy(fullCss)}
          />
          <TooltipButton
            icon={Download}
            tooltip={`Export (${formatShortcut("E")})`}
            onClick={() => openExportDialog()}
          />

          <ThemeToggleButton />

          <Separator orientation="vertical" className="mx-1.5 h-4" />
          
          <Socials />
        </TooltipProvider>
      </div>
    </header>
  );
}

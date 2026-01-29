"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { ExportFormat, ExportSettings } from "@/lib/types";
import { useCanvasExport } from "@/hooks/use-canvas-export";
import { useStudioStore } from "@/hooks/use-studio-store";

export function ExportDialog() {
  const open = useStudioStore((s) => s.ui.exportDialogOpen);
  const openExportDialog = useStudioStore((s) => s.openExportDialog);
  const closeExportDialog = useStudioStore((s) => s.closeExportDialog);
  const [settings, setSettings] = useState<ExportSettings>({
    format: "png",
    scale: 1,
    quality: 0.92,
  });
  const { exportImage, isExporting } = useCanvasExport();

  const handleOpenChange = (value: boolean) => {
    if (value) {
      openExportDialog();
    } else {
      closeExportDialog();
    }
  };

  const handleExport = async () => {
    await exportImage(settings);
    closeExportDialog();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[340px]">
        <DialogHeader>
          <DialogTitle className="text-sm">Export Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label className="text-xs">Format</Label>
            <Select
              value={settings.format}
              onValueChange={(v) => setSettings({ ...settings, format: v as ExportFormat })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png" className="text-xs">PNG</SelectItem>
                <SelectItem value="jpeg" className="text-xs">JPEG</SelectItem>
                <SelectItem value="webp" className="text-xs">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Scale</Label>
            <Select
              value={String(settings.scale)}
              onValueChange={(v) => setSettings({ ...settings, scale: Number(v) as 1 | 2 | 4 })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1" className="text-xs">1x</SelectItem>
                <SelectItem value="2" className="text-xs">2x</SelectItem>
                <SelectItem value="4" className="text-xs">4x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.format !== "png" && (
            <div className="space-y-1">
              <Label className="text-xs">
                Quality: {Math.round(settings.quality * 100)}%
              </Label>
              <Slider
                value={[settings.quality]}
                min={0.1}
                max={1}
                step={0.05}
                onValueChange={([v]) => setSettings({ ...settings, quality: v })}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

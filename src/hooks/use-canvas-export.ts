"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { ExportSettings } from "@/lib/types";
import { renderToCanvas } from "@/lib/canvas/render-to-canvas";
import { useStudioStoreBase, selectStudioState } from "@/lib/store/studio-store";

export function useCanvasExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = useCallback(
    async (settings: ExportSettings) => {
      const state = selectStudioState(useStudioStoreBase.getState());

      if (!state.image) {
        toast.error("No image loaded");
        return;
      }

      setIsExporting(true);
      try {
        const blob = await renderToCanvas(state, settings);
        if (!blob) {
          toast.error("Export failed");
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const ext = settings.format;
        const baseName = state.image.fileName.replace(/\.[^.]+$/, "");
        a.href = url;
        a.download = `${baseName}-masked.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Image exported");
      } catch {
        toast.error("Export failed");
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportImage, isExporting };
}

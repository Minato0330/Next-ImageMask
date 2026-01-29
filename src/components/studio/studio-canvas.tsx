"use client";

import { ZoomIn, ZoomOut, Maximize, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useStudioStore } from "@/hooks/use-studio-store";
import { ImagePreview } from "@/components/canvas/image-preview";
import { CheckerboardBg } from "@/components/canvas/checkerboard-bg";
import { ExportDialog } from "@/components/canvas/export-dialog";
import { useImageUpload } from "@/hooks/use-image-upload";

export function StudioCanvas() {
  const image = useStudioStore((s) => s.image);
  const viewport = useStudioStore((s) => s.viewport);
  const setViewportZoom = useStudioStore((s) => s.setViewportZoom);
  const resetViewport = useStudioStore((s) => s.resetViewport);
  const { zoom } = viewport;

  const {
    isDragging,
    inputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFilePicker,
    handleInputChange,
  } = useImageUpload();

  const zoomIn = () => setViewportZoom(Math.min(zoom + 0.25, 5));
  const zoomOut = () => setViewportZoom(Math.max(zoom - 0.25, 0.1));
  const fitView = () => resetViewport();

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/30"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CheckerboardBg />

      {isDragging && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-foreground/20 px-12 py-10">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drop image here</p>
          </div>
        </div>
      )}

      {image ? (
        <div
          className="relative"
          style={{
            transform: `scale(${zoom}) translate(${viewport.panX}px, ${viewport.panY}px)`,
            transformOrigin: "center center",
          }}
        >
          <ImagePreview />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Upload className="h-6 w-6 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              Drop an image here to get started
            </p>
            <p className="text-xs text-muted-foreground/60">or</p>
          </div>
          <Button variant="outline" size="sm" onClick={openFilePicker}>
            Browse Files
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Zoom controls */}
      <div data-slot="zoom-controls" className="absolute bottom-3 right-3 flex items-center gap-0.5 rounded-lg border border-border bg-background/90 p-0.5 backdrop-blur-md">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-xs" onClick={zoomOut}>
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Zoom out (-)</TooltipContent>
          </Tooltip>

          <span className="min-w-[3rem] text-center font-mono text-[11px] text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-xs" onClick={zoomIn}>
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Zoom in (+)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-xs" onClick={fitView}>
                <Maximize className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Fit to view (0)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ExportDialog />
    </div>
  );
}

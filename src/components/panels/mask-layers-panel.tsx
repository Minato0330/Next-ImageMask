"use client";

import { useCallback, useRef } from "react";
import { Plus, Eye, EyeOff, Copy, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioStore } from "@/hooks/use-studio-store";
import { MaskLayerEditor } from "./mask-layer-editor";
import { cn } from "@/lib/utils";

export function MaskLayersPanel() {
  const maskLayers = useStudioStore((s) => s.maskLayers);
  const activeMaskLayerId = useStudioStore((s) => s.activeMaskLayerId);
  const addMaskLayer = useStudioStore((s) => s.addMaskLayer);
  const removeMaskLayer = useStudioStore((s) => s.removeMaskLayer);
  const duplicateMaskLayer = useStudioStore((s) => s.duplicateMaskLayer);
  const toggleMaskLayerVisibility = useStudioStore((s) => s.toggleMaskLayerVisibility);
  const setActiveMaskLayer = useStudioStore((s) => s.setActiveMaskLayer);
  const reorderMaskLayers = useStudioStore((s) => s.reorderMaskLayers);

  const dragItem = useRef<string | null>(null);
  const dragOver = useRef<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    dragItem.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragEnter = useCallback((id: string) => {
    dragOver.current = id;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragItem.current && dragOver.current && dragItem.current !== dragOver.current) {
      const ids = maskLayers.map((l) => l.id);
      const fromIdx = ids.indexOf(dragItem.current);
      const toIdx = ids.indexOf(dragOver.current);
      if (fromIdx !== -1 && toIdx !== -1) {
        const reordered = [...ids];
        reordered.splice(fromIdx, 1);
        reordered.splice(toIdx, 0, dragItem.current);
        reorderMaskLayers(reordered);
      }
    }
    dragItem.current = null;
    dragOver.current = null;
  }, [maskLayers, reorderMaskLayers]);

  const activeLayer = maskLayers.find((l) => l.id === activeMaskLayerId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Layers</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => addMaskLayer()}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {maskLayers.length === 0 && (
        <div className="rounded-md border border-dashed border-border/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">No mask layers yet</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2.5 text-xs"
            onClick={() => addMaskLayer()}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Layer
          </Button>
        </div>
      )}

      <div className="space-y-0.5">
        {maskLayers.map((layer) => (
          <div
            key={layer.id}
            className={cn(
              "group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
              layer.id === activeMaskLayerId
                ? "bg-accent text-accent-foreground shadow-sm"
                : "hover:bg-muted/60"
            )}
            onClick={() => setActiveMaskLayer(layer.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, layer.id)}
            onDragEnter={() => handleDragEnter(layer.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/50" />
            <span className="flex-1 truncate">{layer.name}</span>
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 data-[active=true]:opacity-100"
              data-active={layer.id === activeMaskLayerId}
            >
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaskLayerVisibility(layer.id);
                }}
              >
                {layer.visible ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateMaskLayer(layer.id);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMaskLayer(layer.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {activeLayer && (
        <div className="border-t border-border/50 pt-3">
          <MaskLayerEditor layer={activeLayer} />
        </div>
      )}
    </div>
  );
}

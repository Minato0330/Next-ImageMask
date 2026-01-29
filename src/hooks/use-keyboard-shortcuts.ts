"use client";

import { useEffect } from "react";
import { useStudioStore } from "./use-studio-store";
import { useCssGenerator } from "./use-css-generator";
import { useClipboard } from "./use-clipboard";
import type { CssOutputTab } from "@/lib/types";

export function useKeyboardShortcuts() {
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const openExportDialog = useStudioStore((s) => s.openExportDialog);
  const removeMaskLayer = useStudioStore((s) => s.removeMaskLayer);
  const setViewportZoom = useStudioStore((s) => s.setViewportZoom);
  const resetViewport = useStudioStore((s) => s.resetViewport);
  const activeMaskLayerId = useStudioStore((s) => s.activeMaskLayerId);
  const zoom = useStudioStore((s) => s.viewport.zoom);
  const cssOutputTab = useStudioStore((s) => s.ui.cssOutputTab);
  const { fullCss, maskCss, filterCss, clipCss } = useCssGenerator();
  const { copy } = useClipboard();

  useEffect(() => {
    const getCssForTab = (tab: CssOutputTab) => {
      switch (tab) {
        case "full": return fullCss;
        case "mask": return maskCss;
        case "filter": return filterCss;
        case "clip": return clipCss;
      }
    };

    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
        return;
      }

      if (meta && e.shiftKey && e.key === "z") {
        e.preventDefault();
        redo();
        return;
      }

      if (meta && e.shiftKey && e.key === "c") {
        e.preventDefault();
        copy(getCssForTab(cssOutputTab));
        return;
      }

      if (meta && e.key === "e") {
        e.preventDefault();
        openExportDialog();
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && !isInputFocused()) {
        if (activeMaskLayerId) {
          e.preventDefault();
          removeMaskLayer(activeMaskLayerId);
        }
        return;
      }

      if (!isInputFocused()) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          setViewportZoom(Math.min(zoom + 0.1, 5));
          return;
        }
        if (e.key === "-") {
          e.preventDefault();
          setViewportZoom(Math.max(zoom - 0.1, 0.1));
          return;
        }
        if (e.key === "0") {
          e.preventDefault();
          resetViewport();
          return;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, copy, activeMaskLayerId, zoom, cssOutputTab, fullCss, maskCss, filterCss, clipCss, openExportDialog, removeMaskLayer, setViewportZoom, resetViewport]);
}

function isInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || (el as HTMLElement).isContentEditable;
}

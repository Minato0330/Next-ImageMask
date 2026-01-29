"use client";

import { useMemo } from "react";
import { useStudioStore } from "./use-studio-store";
import { useShallow } from "zustand/react/shallow";
import { generateFullCss, generateMaskOnlyCss, generateFilterOnlyCss, generateClipOnlyCss } from "@/lib/css/generate-full-css";

export function useCssGenerator() {
  const { maskLayers, filters, blendMode, clipPath } = useStudioStore(
    useShallow((s) => ({
      maskLayers: s.maskLayers,
      filters: s.filters,
      blendMode: s.blendMode,
      clipPath: s.clipPath,
    }))
  );

  const state = { maskLayers, filters, blendMode, clipPath } as Parameters<typeof generateFullCss>[0];

  const fullCss = useMemo(() => generateFullCss(state), [maskLayers, filters, blendMode, clipPath]);
  const maskCss = useMemo(() => generateMaskOnlyCss(state), [maskLayers, filters, blendMode, clipPath]);
  const filterCss = useMemo(() => generateFilterOnlyCss(state), [maskLayers, filters, blendMode, clipPath]);
  const clipCss = useMemo(() => generateClipOnlyCss(state), [maskLayers, filters, blendMode, clipPath]);

  return { fullCss, maskCss, filterCss, clipCss };
}

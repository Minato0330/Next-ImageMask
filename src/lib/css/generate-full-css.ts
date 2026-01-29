import type { StudioState } from "../types";
import { generateMaskCss } from "./generate-mask-css";
import { generateFilterCss } from "./generate-filter-css";
import { generateClipPathCss } from "./generate-clip-path-css";

export function generateFullCss(state: StudioState): string {
  const lines: string[] = [];
  lines.push(".masked-image {");

  const maskCss = generateMaskCss(state.maskLayers);
  if (maskCss) lines.push(maskCss);

  const filterCss = generateFilterCss(state.filters);
  if (filterCss) lines.push(filterCss);

  const clipCss = generateClipPathCss(state.clipPath);
  if (clipCss) lines.push(clipCss);

  if (state.blendMode !== "normal") {
    lines.push(`  mix-blend-mode: ${state.blendMode};`);
  }

  lines.push("}");
  return lines.join("\n");
}

export function generateMaskOnlyCss(state: StudioState): string {
  const maskCss = generateMaskCss(state.maskLayers);
  if (!maskCss) return "/* No mask layers */";
  return `.masked-image {\n${maskCss}\n}`;
}

export function generateFilterOnlyCss(state: StudioState): string {
  const filterCss = generateFilterCss(state.filters);
  if (!filterCss) return "/* No filters applied */";
  return `.masked-image {\n${filterCss}\n}`;
}

export function generateClipOnlyCss(state: StudioState): string {
  const clipCss = generateClipPathCss(state.clipPath);
  if (!clipCss) return "/* No clip-path applied */";
  return `.masked-image {\n${clipCss}\n}`;
}

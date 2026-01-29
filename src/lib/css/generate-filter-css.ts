import type { Filters } from "../types";
import { hexToRgb } from "../gradient/color-utils";

export function buildFilterValue(filters: Filters): string {
  const parts: string[] = [];

  if (filters.blur !== 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
  if (filters.grayscale !== 0) parts.push(`grayscale(${filters.grayscale}%)`);
  if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
  if (filters.invert !== 0) parts.push(`invert(${filters.invert}%)`);
  if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`);
  if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
  if (filters.sepia !== 0) parts.push(`sepia(${filters.sepia}%)`);
  if (filters.dropShadow.enabled) {
    const ds = filters.dropShadow;
    const { r, g, b } = hexToRgb(ds.color);
    parts.push(`drop-shadow(${ds.x}px ${ds.y}px ${ds.blur}px rgba(${r},${g},${b},${ds.colorOpacity}))`);
  }

  return parts.join(" ");
}

export function generateFilterCss(filters: Filters): string {
  const value = buildFilterValue(filters);
  if (!value) return "";
  return `  filter: ${value};`;
}

import type { GradientStop } from "../types";

// --- Hex <-> RGB ---

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// --- Hex <-> HSL ---

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  if (s === 0) {
    const v = Math.round(l * 255);
    return rgbToHex(v, v, v);
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return rgbToHex(
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
  );
}

// --- Interpolation ---

export function interpolateAtPosition(
  stops: GradientStop[],
  position: number
): { color: string; opacity: number } {
  const sorted = stops.slice().sort((a, b) => a.position - b.position);
  if (sorted.length === 0) return { color: "#808080", opacity: 1 };
  if (sorted.length === 1) return { color: sorted[0].color, opacity: sorted[0].opacity };
  if (position <= sorted[0].position) return { color: sorted[0].color, opacity: sorted[0].opacity };
  if (position >= sorted[sorted.length - 1].position) {
    const last = sorted[sorted.length - 1];
    return { color: last.color, opacity: last.opacity };
  }

  let left = sorted[0];
  let right = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (position >= sorted[i].position && position <= sorted[i + 1].position) {
      left = sorted[i];
      right = sorted[i + 1];
      break;
    }
  }

  const range = right.position - left.position;
  const t = range === 0 ? 0 : (position - left.position) / range;

  const leftRgb = hexToRgb(left.color.startsWith("#") ? left.color : "#000000");
  const rightRgb = hexToRgb(right.color.startsWith("#") ? right.color : "#000000");

  const r = Math.round(leftRgb.r + (rightRgb.r - leftRgb.r) * t);
  const g = Math.round(leftRgb.g + (rightRgb.g - leftRgb.g) * t);
  const b = Math.round(leftRgb.b + (rightRgb.b - leftRgb.b) * t);
  const opacity = left.opacity + (right.opacity - left.opacity) * t;

  return { color: rgbToHex(r, g, b), opacity: Math.round(opacity * 100) / 100 };
}

// --- Contrast ---

export function contrastingColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // Relative luminance (sRGB)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// --- Validation ---

export function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

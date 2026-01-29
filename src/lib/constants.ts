import type { BlendMode, Filters, ClipPath, DropShadow } from "./types";

export const BLEND_MODES: BlendMode[] = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];

export const MASK_REPEAT_OPTIONS = [
  "no-repeat",
  "repeat",
  "repeat-x",
  "repeat-y",
  "space",
  "round",
] as const;

export const MASK_ORIGIN_OPTIONS = [
  "border-box",
  "padding-box",
  "content-box",
] as const;

export const MASK_CLIP_OPTIONS = [
  "border-box",
  "padding-box",
  "content-box",
  "no-clip",
] as const;

export const MASK_COMPOSITE_OPTIONS = [
  "add",
  "subtract",
  "intersect",
  "exclude",
] as const;

export const MASK_MODE_OPTIONS = [
  "alpha",
  "luminance",
  "match-source",
] as const;

export const GRADIENT_TYPE_OPTIONS = [
  "linear-gradient",
  "radial-gradient",
  "conic-gradient",
] as const;

export const RADIAL_SHAPE_OPTIONS = ["circle", "ellipse"] as const;

export const RADIAL_SIZE_OPTIONS = [
  "closest-side",
  "farthest-side",
  "closest-corner",
  "farthest-corner",
] as const;

export const CLIP_PATH_TYPES = [
  "none",
  "circle",
  "ellipse",
  "inset",
  "polygon",
  "custom",
] as const;

export const POLYGON_PRESETS: Record<string, { x: number; y: number }[]> = {
  triangle: [
    { x: 50, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ],
  pentagon: [
    { x: 50, y: 0 },
    { x: 100, y: 38 },
    { x: 82, y: 100 },
    { x: 18, y: 100 },
    { x: 0, y: 38 },
  ],
  hexagon: [
    { x: 50, y: 0 },
    { x: 100, y: 25 },
    { x: 100, y: 75 },
    { x: 50, y: 100 },
    { x: 0, y: 75 },
    { x: 0, y: 25 },
  ],
  star: [
    { x: 50, y: 0 },
    { x: 61, y: 35 },
    { x: 98, y: 35 },
    { x: 68, y: 57 },
    { x: 79, y: 91 },
    { x: 50, y: 70 },
    { x: 21, y: 91 },
    { x: 32, y: 57 },
    { x: 2, y: 35 },
    { x: 39, y: 35 },
  ],
  arrow: [
    { x: 40, y: 0 },
    { x: 60, y: 0 },
    { x: 60, y: 60 },
    { x: 100, y: 60 },
    { x: 50, y: 100 },
    { x: 0, y: 60 },
    { x: 40, y: 60 },
  ],
  cross: [
    { x: 35, y: 0 },
    { x: 65, y: 0 },
    { x: 65, y: 35 },
    { x: 100, y: 35 },
    { x: 100, y: 65 },
    { x: 65, y: 65 },
    { x: 65, y: 100 },
    { x: 35, y: 100 },
    { x: 35, y: 65 },
    { x: 0, y: 65 },
    { x: 0, y: 35 },
    { x: 35, y: 35 },
  ],
};

export const DEFAULT_DROP_SHADOW: DropShadow = {
  enabled: false,
  x: 4,
  y: 4,
  blur: 8,
  color: "#000000",
  colorOpacity: 0.5,
};

export const DEFAULT_FILTERS: Filters = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
  dropShadow: DEFAULT_DROP_SHADOW,
};

export const DEFAULT_CLIP_PATH: ClipPath = { type: "none" };

export const FILTER_CONFIG = [
  { key: "blur" as const, label: "Blur", min: 0, max: 50, default: 0, unit: "px" },
  { key: "brightness" as const, label: "Brightness", min: 0, max: 300, default: 100, unit: "%" },
  { key: "contrast" as const, label: "Contrast", min: 0, max: 300, default: 100, unit: "%" },
  { key: "grayscale" as const, label: "Grayscale", min: 0, max: 100, default: 0, unit: "%" },
  { key: "hueRotate" as const, label: "Hue Rotate", min: 0, max: 360, default: 0, unit: "deg" },
  { key: "invert" as const, label: "Invert", min: 0, max: 100, default: 0, unit: "%" },
  { key: "opacity" as const, label: "Opacity", min: 0, max: 100, default: 100, unit: "%" },
  { key: "saturate" as const, label: "Saturate", min: 0, max: 300, default: 100, unit: "%" },
  { key: "sepia" as const, label: "Sepia", min: 0, max: 100, default: 0, unit: "%" },
] as const;

export const MAX_HISTORY = 50;
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

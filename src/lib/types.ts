export interface GradientStop {
  id: string;
  color: string;
  position: number;
  opacity: number;
}

export interface LinearGradient {
  type: "linear-gradient";
  angle: number;
  stops: GradientStop[];
  repeating: boolean;
}

export interface RadialGradient {
  type: "radial-gradient";
  shape: "circle" | "ellipse";
  sizeKeyword: "closest-side" | "farthest-side" | "closest-corner" | "farthest-corner";
  centerX: number;
  centerY: number;
  stops: GradientStop[];
  repeating: boolean;
}

export interface ConicGradient {
  type: "conic-gradient";
  fromAngle: number;
  centerX: number;
  centerY: number;
  stops: GradientStop[];
  repeating: boolean;
}

export interface UrlMask {
  type: "url";
  url: string;
}

export type MaskImage = LinearGradient | RadialGradient | ConicGradient | UrlMask;

export interface MaskLayer {
  id: string;
  visible: boolean;
  name: string;
  maskImage: MaskImage;
  maskPosition: { x: string; y: string };
  maskSize: { width: string; height: string };
  maskRepeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y" | "space" | "round";
  maskOrigin: "border-box" | "padding-box" | "content-box";
  maskClip: "border-box" | "padding-box" | "content-box" | "no-clip";
  maskComposite: "add" | "subtract" | "intersect" | "exclude";
  maskMode: "alpha" | "luminance" | "match-source";
}

export interface DropShadow {
  enabled: boolean;
  x: number;
  y: number;
  blur: number;
  color: string;          // hex, e.g. "#000000"
  colorOpacity: number;   // 0-1
}

export interface Filters {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
  dropShadow: DropShadow;
}

export interface ClipPathNone {
  type: "none";
}

export interface ClipPathCircle {
  type: "circle";
  radius: number;
  centerX: number;
  centerY: number;
}

export interface ClipPathEllipse {
  type: "ellipse";
  radiusX: number;
  radiusY: number;
  centerX: number;
  centerY: number;
}

export interface ClipPathInset {
  type: "inset";
  top: number;
  right: number;
  bottom: number;
  left: number;
  borderRadius: number;
}

export interface ClipPathPolygon {
  type: "polygon";
  points: { x: number; y: number }[];
  preset: string;
}

export interface ClipPathCustom {
  type: "custom";
  value: string;
}

export type ClipPath =
  | ClipPathNone
  | ClipPathCircle
  | ClipPathEllipse
  | ClipPathInset
  | ClipPathPolygon
  | ClipPathCustom;

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export interface ImageData {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  fileName: string;
}

export interface Viewport {
  zoom: number;
  panX: number;
  panY: number;
}

export type SidebarPanel = "masks" | "filters" | "clip" | "presets";
export type CssOutputTab = "full" | "mask" | "filter" | "clip";

export interface UIState {
  activePanel: SidebarPanel;
  cssOutputExpanded: boolean;
  cssOutputTab: CssOutputTab;
  exportDialogOpen: boolean;
}

export interface StudioState {
  image: ImageData | null;
  maskLayers: MaskLayer[];
  activeMaskLayerId: string | null;
  filters: Filters;
  blendMode: BlendMode;
  clipPath: ClipPath;
  viewport: Viewport;
  ui: UIState;
}

export interface Preset {
  id: string;
  name: string;
  category: "mask" | "filter" | "clip" | "combined";
  description: string;
  apply: Partial<Pick<StudioState, "maskLayers" | "filters" | "blendMode" | "clipPath">>;
}

export type ExportFormat = "png" | "jpeg" | "webp";

export interface ExportSettings {
  format: ExportFormat;
  scale: 1 | 2 | 4;
  quality: number;
}

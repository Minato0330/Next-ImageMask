import type { StudioState, MaskLayer, LinearGradient, GradientStop } from "../types";
import { DEFAULT_FILTERS, DEFAULT_CLIP_PATH } from "../constants";

let _id = 0;
export function generateId(): string {
  return `${Date.now()}-${++_id}`;
}

export function createDefaultGradientStop(
  position: number,
  color: string,
  opacity: number = 1
): GradientStop {
  return { id: generateId(), color, position, opacity };
}

export function createDefaultLinearGradient(): LinearGradient {
  return {
    type: "linear-gradient",
    angle: 180,
    stops: [
      createDefaultGradientStop(0, "#000000", 1),
      createDefaultGradientStop(100, "#000000", 0),
    ],
    repeating: false,
  };
}

export function createDefaultMaskLayer(name?: string): MaskLayer {
  return {
    id: generateId(),
    visible: true,
    name: name || "Mask Layer",
    maskImage: createDefaultLinearGradient(),
    maskPosition: { x: "center", y: "center" },
    maskSize: { width: "100%", height: "100%" },
    maskRepeat: "no-repeat",
    maskOrigin: "border-box",
    maskClip: "border-box",
    maskComposite: "add",
    maskMode: "alpha",
  };
}

export function createInitialState(): StudioState {
  return {
    image: null,
    maskLayers: [],
    activeMaskLayerId: null,
    filters: { ...DEFAULT_FILTERS, dropShadow: { ...DEFAULT_FILTERS.dropShadow } },
    blendMode: "normal",
    clipPath: DEFAULT_CLIP_PATH,
    viewport: { zoom: 1, panX: 0, panY: 0 },
    ui: {
      activePanel: "masks",
      cssOutputExpanded: false,
      cssOutputTab: "full",
      exportDialogOpen: false,
    },
  };
}

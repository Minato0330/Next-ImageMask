import type { Preset, MaskLayer, Filters, ClipPath } from "../types";
import { DEFAULT_FILTERS } from "../constants";
import { generateId, createDefaultGradientStop } from "../store/initial-state";

function makeLayer(overrides: Partial<MaskLayer> & Pick<MaskLayer, "maskImage">): MaskLayer {
  return {
    id: generateId(),
    visible: true,
    name: "Preset Layer",
    maskPosition: { x: "center", y: "center" },
    maskSize: { width: "100%", height: "100%" },
    maskRepeat: "no-repeat",
    maskOrigin: "border-box",
    maskClip: "border-box",
    maskComposite: "add",
    maskMode: "alpha",
    ...overrides,
  };
}

export const PRESETS: Preset[] = [

  {
    id: "fade-bottom",
    name: "Fade Bottom",
    category: "mask",
    description: "Fades to transparent at the bottom",
    apply: {
      maskLayers: [
        makeLayer({
          name: "Fade Bottom",
          maskImage: {
            type: "linear-gradient",
            angle: 180,
            stops: [
              createDefaultGradientStop(0, "#000000", 1),
              createDefaultGradientStop(70, "#000000", 1),
              createDefaultGradientStop(100, "#000000", 0),
            ],
            repeating: false,
          },
        }),
      ],
    },
  },
  {
    id: "fade-edges",
    name: "Fade Edges",
    category: "mask",
    description: "Fades all edges to transparent",
    apply: {
      maskLayers: [
        makeLayer({
          name: "Fade Edges",
          maskImage: {
            type: "radial-gradient",
            shape: "ellipse",
            sizeKeyword: "farthest-corner",
            centerX: 50,
            centerY: 50,
            stops: [
              createDefaultGradientStop(0, "#000000", 1),
              createDefaultGradientStop(60, "#000000", 1),
              createDefaultGradientStop(100, "#000000", 0),
            ],
            repeating: false,
          },
        }),
      ],
    },
  },
  {
    id: "vignette",
    name: "Vignette",
    category: "mask",
    description: "Dark vignette around edges",
    apply: {
      maskLayers: [
        makeLayer({
          name: "Vignette",
          maskImage: {
            type: "radial-gradient",
            shape: "ellipse",
            sizeKeyword: "farthest-corner",
            centerX: 50,
            centerY: 50,
            stops: [
              createDefaultGradientStop(0, "#000000", 1),
              createDefaultGradientStop(50, "#000000", 1),
              createDefaultGradientStop(100, "#000000", 0),
            ],
            repeating: false,
          },
        }),
      ],
    },
  },
  {
    id: "spotlight",
    name: "Spotlight",
    category: "mask",
    description: "Circular spotlight in center",
    apply: {
      maskLayers: [
        makeLayer({
          name: "Spotlight",
          maskImage: {
            type: "radial-gradient",
            shape: "circle",
            sizeKeyword: "closest-side",
            centerX: 50,
            centerY: 50,
            stops: [
              createDefaultGradientStop(0, "#000000", 1),
              createDefaultGradientStop(80, "#000000", 1),
              createDefaultGradientStop(100, "#000000", 0),
            ],
            repeating: false,
          },
        }),
      ],
    },
  },
  {
    id: "diagonal-wipe",
    name: "Diagonal Wipe",
    category: "mask",
    description: "Diagonal transition wipe",
    apply: {
      maskLayers: [
        makeLayer({
          name: "Diagonal Wipe",
          maskImage: {
            type: "linear-gradient",
            angle: 135,
            stops: [
              createDefaultGradientStop(0, "#000000", 1),
              createDefaultGradientStop(40, "#000000", 1),
              createDefaultGradientStop(60, "#000000", 0),
            ],
            repeating: false,
          },
        }),
      ],
    },
  },
  {
    id: "wave",
    name: "Wave",
    category: "mask",
    description: "Repeating wave pattern",
    apply: {
      maskLayers: [
        makeLayer({
          name: "Wave",
          maskImage: {
            type: "linear-gradient",
            angle: 0,
            stops: [
              createDefaultGradientStop(0, "#000000", 1),
              createDefaultGradientStop(50, "#000000", 0),
              createDefaultGradientStop(100, "#000000", 1),
            ],
            repeating: true,
          },
          maskSize: { width: "100%", height: "20%" },
          maskRepeat: "repeat",
        }),
      ],
    },
  },


  {
    id: "vintage",
    name: "Vintage",
    category: "filter",
    description: "Warm vintage film look",
    apply: {
      filters: {
        ...DEFAULT_FILTERS,
        sepia: 40,
        saturate: 80,
        contrast: 110,
        brightness: 105,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
    },
  },
  {
    id: "noir",
    name: "Noir",
    category: "filter",
    description: "Black and white film noir",
    apply: {
      filters: {
        ...DEFAULT_FILTERS,
        grayscale: 100,
        contrast: 130,
        brightness: 90,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
    },
  },
  {
    id: "warm",
    name: "Warm",
    category: "filter",
    description: "Warm golden tone",
    apply: {
      filters: {
        ...DEFAULT_FILTERS,
        sepia: 20,
        saturate: 130,
        brightness: 105,
        hueRotate: 350,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
    },
  },
  {
    id: "cool",
    name: "Cool",
    category: "filter",
    description: "Cool blue tone",
    apply: {
      filters: {
        ...DEFAULT_FILTERS,
        saturate: 80,
        brightness: 105,
        hueRotate: 190,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
    },
  },
  {
    id: "high-contrast",
    name: "High Contrast",
    category: "filter",
    description: "Punchy high contrast",
    apply: {
      filters: {
        ...DEFAULT_FILTERS,
        contrast: 150,
        saturate: 120,
        brightness: 105,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
    },
  },
  {
    id: "dreamy",
    name: "Dreamy",
    category: "filter",
    description: "Soft dreamy blur",
    apply: {
      filters: {
        ...DEFAULT_FILTERS,
        blur: 1,
        brightness: 110,
        saturate: 120,
        contrast: 90,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
    },
  },


  {
    id: "clip-circle",
    name: "Circle",
    category: "clip",
    description: "Circular crop",
    apply: {
      clipPath: { type: "circle", radius: 45, centerX: 50, centerY: 50 },
    },
  },
  {
    id: "clip-rounded",
    name: "Rounded",
    category: "clip",
    description: "Rounded rectangle crop",
    apply: {
      clipPath: { type: "inset", top: 2, right: 2, bottom: 2, left: 2, borderRadius: 10 },
    },
  },
  {
    id: "clip-diamond",
    name: "Diamond",
    category: "clip",
    description: "Diamond shape crop",
    apply: {
      clipPath: {
        type: "polygon",
        points: [
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 50, y: 100 },
          { x: 0, y: 50 },
        ],
        preset: "diamond",
      },
    },
  },
  {
    id: "clip-star",
    name: "Star",
    category: "clip",
    description: "Star shape crop",
    apply: {
      clipPath: {
        type: "polygon",
        points: [
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
        preset: "star",
      },
    },
  },
  {
    id: "clip-hexagon",
    name: "Hexagon",
    category: "clip",
    description: "Hexagon shape crop",
    apply: {
      clipPath: {
        type: "polygon",
        points: [
          { x: 50, y: 0 },
          { x: 100, y: 25 },
          { x: 100, y: 75 },
          { x: 50, y: 100 },
          { x: 0, y: 75 },
          { x: 0, y: 25 },
        ],
        preset: "hexagon",
      },
    },
  },


  {
    id: "cinematic",
    name: "Cinematic",
    category: "combined",
    description: "Cinematic widescreen with color grading",
    apply: {
      maskLayers: [
        makeLayer({
          name: "Cinematic Mask",
          maskImage: {
            type: "radial-gradient",
            shape: "ellipse",
            sizeKeyword: "farthest-corner",
            centerX: 50,
            centerY: 50,
            stops: [
              createDefaultGradientStop(0, "#000000", 1),
              createDefaultGradientStop(60, "#000000", 1),
              createDefaultGradientStop(100, "#000000", 0.3),
            ],
            repeating: false,
          },
        }),
      ],
      filters: {
        ...DEFAULT_FILTERS,
        contrast: 120,
        saturate: 80,
        brightness: 95,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
      clipPath: { type: "inset", top: 10, right: 0, bottom: 10, left: 0, borderRadius: 0 },
    },
  },
  {
    id: "polaroid",
    name: "Polaroid",
    category: "combined",
    description: "Vintage polaroid frame",
    apply: {
      filters: {
        ...DEFAULT_FILTERS,
        sepia: 30,
        contrast: 110,
        brightness: 110,
        saturate: 90,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
      clipPath: { type: "inset", top: 2, right: 2, bottom: 2, left: 2, borderRadius: 1 },
    },
  },
  {
    id: "duotone",
    name: "Duotone",
    category: "combined",
    description: "Duotone color effect",
    apply: {
      filters: {
        ...DEFAULT_FILTERS,
        grayscale: 100,
        sepia: 100,
        hueRotate: 180,
        saturate: 200,
        brightness: 90,
        contrast: 120,
        dropShadow: { ...DEFAULT_FILTERS.dropShadow },
      },
    },
  },
];

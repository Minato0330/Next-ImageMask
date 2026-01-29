import { create } from "zustand";
import type {
  StudioState,
  MaskLayer,
  MaskImage,
  Filters,
  BlendMode,
  ClipPath,
  SidebarPanel,
  CssOutputTab,
  ImageData,
  DropShadow,
} from "../types";
import { createDefaultMaskLayer, generateId, createInitialState } from "./initial-state";
import { MAX_HISTORY } from "../constants";

// ---------------------------------------------------------------------------
// History helpers
// ---------------------------------------------------------------------------

interface History {
  past: StudioState[];
  future: StudioState[];
}

/** Push the current state onto the history stack before applying an update. */
function withHistory(
  set: (fn: (s: StudioStoreState) => Partial<StudioStoreState>) => void,
  get: () => StudioStoreState,
  updater: (state: StudioState) => Partial<StudioState>
) {
  set((s) => {
    const snapshot = selectStudioState(s);
    const changes = updater(snapshot);
    return {
      ...changes,
      _history: {
        past: [...s._history.past, snapshot].slice(-MAX_HISTORY),
        future: [],
      },
    };
  });
}

/** Apply an update that skips history (UI-only state). */
function withoutHistory(
  set: (fn: (s: StudioStoreState) => Partial<StudioStoreState>) => void,
  updater: (state: StudioState) => Partial<StudioState>
) {
  set((s) => updater(selectStudioState(s)));
}

// ---------------------------------------------------------------------------
// Public selector – extracts the plain StudioState from the store
// ---------------------------------------------------------------------------

export function selectStudioState(s: StudioStoreState): StudioState {
  return {
    image: s.image,
    maskLayers: s.maskLayers,
    activeMaskLayerId: s.activeMaskLayerId,
    filters: s.filters,
    blendMode: s.blendMode,
    clipPath: s.clipPath,
    viewport: s.viewport,
    ui: s.ui,
  };
}

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

export interface StudioStoreState extends StudioState {
  _history: History;

  // Image
  setImage: (payload: ImageData) => void;
  clearImage: () => void;

  // Mask layers
  addMaskLayer: () => void;
  removeMaskLayer: (id: string) => void;
  duplicateMaskLayer: (id: string) => void;
  toggleMaskLayerVisibility: (id: string) => void;
  setActiveMaskLayer: (id: string | null) => void;
  reorderMaskLayers: (ids: string[]) => void;
  updateMaskLayer: (id: string, changes: Partial<MaskLayer>) => void;
  updateMaskImage: (layerId: string, maskImage: MaskImage) => void;

  // Filters
  setFilter: (key: keyof Omit<Filters, "dropShadow">, value: number) => void;
  setDropShadow: (changes: Partial<DropShadow>) => void;
  resetFilters: () => void;

  // Blend mode
  setBlendMode: (mode: BlendMode) => void;

  // Clip path
  setClipPath: (clipPath: ClipPath) => void;

  // Viewport (UI-only)
  setViewportZoom: (zoom: number) => void;
  setViewportPan: (panX: number, panY: number) => void;
  resetViewport: () => void;

  // UI panels (UI-only)
  setActivePanel: (panel: SidebarPanel) => void;
  toggleCssOutput: () => void;
  setCssOutputTab: (tab: CssOutputTab) => void;
  openExportDialog: () => void;
  closeExportDialog: () => void;

  // Presets
  applyPreset: (preset: Partial<Pick<StudioState, "maskLayers" | "filters" | "blendMode" | "clipPath">>) => void;

  // Restore full state
  restoreState: (state: StudioState) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useStudioStoreBase = create<StudioStoreState>()((set, get) => {
  const initial = createInitialState();

  return {
    // --- initial data ---
    ...initial,
    _history: { past: [], future: [] },

    // === Image ===
    setImage: (payload) => {
      withHistory(set, get, () => ({ image: payload }));
    },

    clearImage: () => {
      withHistory(set, get, () => ({ image: null }));
    },

    // === Mask layers ===
    addMaskLayer: () => {
      withHistory(set, get, (s) => {
        const layer = createDefaultMaskLayer(`Layer ${s.maskLayers.length + 1}`);
        return {
          maskLayers: [...s.maskLayers, layer],
          activeMaskLayerId: layer.id,
        };
      });
    },

    removeMaskLayer: (id) => {
      withHistory(set, get, (s) => {
        const filtered = s.maskLayers.filter((l) => l.id !== id);
        return {
          maskLayers: filtered,
          activeMaskLayerId:
            s.activeMaskLayerId === id
              ? (filtered[0]?.id ?? null)
              : s.activeMaskLayerId,
        };
      });
    },

    duplicateMaskLayer: (id) => {
      withHistory(set, get, (s) => {
        const idx = s.maskLayers.findIndex((l) => l.id === id);
        if (idx === -1) return {};
        const original = s.maskLayers[idx];
        const dup: MaskLayer = {
          ...JSON.parse(JSON.stringify(original)),
          id: generateId(),
          name: `${original.name} (copy)`,
        };
        const layers = [...s.maskLayers];
        layers.splice(idx + 1, 0, dup);
        return { maskLayers: layers, activeMaskLayerId: dup.id };
      });
    },

    toggleMaskLayerVisibility: (id) => {
      withHistory(set, get, (s) => ({
        maskLayers: s.maskLayers.map((l) =>
          l.id === id ? { ...l, visible: !l.visible } : l
        ),
      }));
    },

    setActiveMaskLayer: (id) => {
      withoutHistory(set, () => ({ activeMaskLayerId: id }));
    },

    reorderMaskLayers: (ids) => {
      withHistory(set, get, (s) => {
        const map = new Map(s.maskLayers.map((l) => [l.id, l]));
        const reordered = ids.map((id) => map.get(id)!).filter(Boolean);
        return { maskLayers: reordered };
      });
    },

    updateMaskLayer: (id, changes) => {
      withHistory(set, get, (s) => ({
        maskLayers: s.maskLayers.map((l) =>
          l.id === id ? { ...l, ...changes } : l
        ),
      }));
    },

    updateMaskImage: (layerId, maskImage) => {
      withHistory(set, get, (s) => ({
        maskLayers: s.maskLayers.map((l) =>
          l.id === layerId ? { ...l, maskImage } : l
        ),
      }));
    },

    // === Filters ===
    setFilter: (key, value) => {
      withHistory(set, get, (s) => ({
        filters: { ...s.filters, [key]: value },
      }));
    },

    setDropShadow: (changes) => {
      withHistory(set, get, (s) => ({
        filters: {
          ...s.filters,
          dropShadow: { ...s.filters.dropShadow, ...changes },
        },
      }));
    },

    resetFilters: () => {
      withHistory(set, get, () => ({
        filters: {
          blur: 0,
          brightness: 100,
          contrast: 100,
          grayscale: 0,
          hueRotate: 0,
          invert: 0,
          opacity: 100,
          saturate: 100,
          sepia: 0,
          dropShadow: { enabled: false, x: 4, y: 4, blur: 8, color: "#000000", colorOpacity: 0.5 },
        },
      }));
    },

    // === Blend mode ===
    setBlendMode: (mode) => {
      withHistory(set, get, () => ({ blendMode: mode }));
    },

    // === Clip path ===
    setClipPath: (clipPath) => {
      withHistory(set, get, () => ({ clipPath }));
    },

    // === Viewport (UI-only – skip history) ===
    setViewportZoom: (zoom) => {
      withoutHistory(set, (s) => ({ viewport: { ...s.viewport, zoom } }));
    },

    setViewportPan: (panX, panY) => {
      withoutHistory(set, (s) => ({ viewport: { ...s.viewport, panX, panY } }));
    },

    resetViewport: () => {
      withoutHistory(set, () => ({ viewport: { zoom: 1, panX: 0, panY: 0 } }));
    },

    // === UI panels (UI-only – skip history) ===
    setActivePanel: (panel) => {
      withoutHistory(set, (s) => ({ ui: { ...s.ui, activePanel: panel } }));
    },

    toggleCssOutput: () => {
      withoutHistory(set, (s) => ({ ui: { ...s.ui, cssOutputExpanded: !s.ui.cssOutputExpanded } }));
    },

    setCssOutputTab: (tab) => {
      withoutHistory(set, (s) => ({ ui: { ...s.ui, cssOutputTab: tab } }));
    },

    openExportDialog: () => {
      withoutHistory(set, (s) => ({ ui: { ...s.ui, exportDialogOpen: true } }));
    },

    closeExportDialog: () => {
      withoutHistory(set, (s) => ({ ui: { ...s.ui, exportDialogOpen: false } }));
    },

    // === Presets ===
    applyPreset: (preset) => {
      withHistory(set, get, (s) => ({
        ...(preset.maskLayers !== undefined && {
          maskLayers: preset.maskLayers,
          activeMaskLayerId: preset.maskLayers[0]?.id ?? null,
        }),
        ...(preset.filters !== undefined && { filters: preset.filters }),
        ...(preset.blendMode !== undefined && { blendMode: preset.blendMode }),
        ...(preset.clipPath !== undefined && { clipPath: preset.clipPath }),
      }));
    },

    // === Restore full state ===
    restoreState: (state) => {
      withHistory(set, get, () => state);
    },

    // === Undo / Redo ===
    undo: () => {
      set((s) => {
        if (s._history.past.length === 0) return s;
        const previous = s._history.past[s._history.past.length - 1];
        const current = selectStudioState(s);
        return {
          ...previous,
          _history: {
            past: s._history.past.slice(0, -1),
            future: [current, ...s._history.future],
          },
        };
      });
    },

    redo: () => {
      set((s) => {
        if (s._history.future.length === 0) return s;
        const next = s._history.future[0];
        const current = selectStudioState(s);
        return {
          ...next,
          _history: {
            past: [...s._history.past, current],
            future: s._history.future.slice(1),
          },
        };
      });
    },

    canUndo: () => get()._history.past.length > 0,
    canRedo: () => get()._history.future.length > 0,
  };
});

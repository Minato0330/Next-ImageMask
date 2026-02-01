import type {
  StudioState,
  MaskLayer,
  MaskImage,
  LinearGradient,
  RadialGradient,
  ConicGradient,
  ExportSettings,
} from "../types";
import { buildFilterValue } from "../css/generate-filter-css";
import { buildClipPathValue } from "../css/generate-clip-path-css";
import { loadImage } from "./image-loader";

export async function renderToCanvas(
  state: StudioState,
  settings: ExportSettings
): Promise<Blob | null> {
  if (!state.image) return null;

  const img = await loadImage(state.image.src);
  const width = state.image.naturalWidth * settings.scale;
  const height = state.image.naturalHeight * settings.scale;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  document.body.appendChild(container);

  const imgEl = document.createElement("img");
  imgEl.src = state.image.src;
  imgEl.style.width = `${width}px`;
  imgEl.style.height = `${height}px`;
  imgEl.style.display = "block";

  const filterValue = buildFilterValue(state.filters);
  if (filterValue) {
    imgEl.style.filter = filterValue;
  }

  if (state.blendMode !== "normal") {
    imgEl.style.mixBlendMode = state.blendMode;
  }

  const clipPathValue = buildClipPathValue(state.clipPath);
  if (clipPathValue) {
    imgEl.style.clipPath = clipPathValue;
  }

  container.appendChild(imgEl);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  if (state.maskLayers.filter((l) => l.visible).length === 0) {
    if (filterValue) {
      ctx.filter = filterValue;
    }

    applyClipPath(ctx, state.clipPath, width, height);

    ctx.drawImage(img, 0, 0, width, height);
  } else {
    // Draw the original image with filters applied
    if (filterValue) {
      ctx.filter = filterValue;
    }

    applyClipPath(ctx, state.clipPath, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    ctx.filter = "none";

    // Apply masks using canvas compositing
    const visibleLayers = state.maskLayers.filter((l) => l.visible);
    const combinedMask = await createCombinedMaskCanvas(visibleLayers, width, height);

    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(combinedMask, 0, 0);
    ctx.globalCompositeOperation = "source-over";
  }

  document.body.removeChild(container);

  const mimeType =
    settings.format === "png"
      ? "image/png"
      : settings.format === "jpeg"
      ? "image/jpeg"
      : "image/webp";

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      mimeType,
      settings.format === "png" ? undefined : settings.quality
    );
  });
}

function applyClipPath(
  ctx: CanvasRenderingContext2D,
  clipPath: StudioState["clipPath"],
  width: number,
  height: number
) {
  if (clipPath.type === "none") return;

  ctx.beginPath();
  switch (clipPath.type) {
    case "circle": {
      const r = (clipPath.radius / 100) * Math.min(width, height);
      const cx = (clipPath.centerX / 100) * width;
      const cy = (clipPath.centerY / 100) * height;
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    }
    case "ellipse": {
      const rx = (clipPath.radiusX / 100) * width;
      const ry = (clipPath.radiusY / 100) * height;
      const cx = (clipPath.centerX / 100) * width;
      const cy = (clipPath.centerY / 100) * height;
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      break;
    }
    case "inset": {
      const t = (clipPath.top / 100) * height;
      const r = (clipPath.right / 100) * width;
      const b = (clipPath.bottom / 100) * height;
      const l = (clipPath.left / 100) * width;
      ctx.rect(l, t, width - l - r, height - t - b);
      break;
    }
    case "polygon": {
      clipPath.points.forEach((p, i) => {
        const x = (p.x / 100) * width;
        const y = (p.y / 100) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      break;
    }
  }
  ctx.clip();
}

// Canvas-based mask compositing functions

const CANVAS_COMPOSITE_MAP: Record<string, GlobalCompositeOperation> = {
  add: "source-over",
  subtract: "source-out",
  intersect: "source-in",
  exclude: "xor",
};

async function createCombinedMaskCanvas(
  layers: MaskLayer[],
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Start with a fully opaque canvas for the first layer
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const layerMask = await createMaskLayerCanvas(layer, width, height);

    if (i === 0) {
      // First layer: just copy it
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(layerMask, 0, 0);
    } else {
      // Apply composite operation for subsequent layers
      const composite = CANVAS_COMPOSITE_MAP[layer.maskComposite] || "source-over";
      ctx.globalCompositeOperation = composite;
      ctx.drawImage(layerMask, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    }
  }

  return canvas;
}

async function createMaskLayerCanvas(
  layer: MaskLayer,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Parse mask size
  const size = parseMaskSize(layer.maskSize, width, height);
  const pos = parseMaskPosition(layer.maskPosition, width, height, size.width, size.height);

  if (layer.maskImage.type === "url") {
    // Load the URL mask as an image
    try {
      const maskImg = await loadImage(layer.maskImage.url);
      ctx.drawImage(maskImg, pos.x, pos.y, size.width, size.height);
    } catch {
      // If loading fails, fill with white (fully opaque)
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    // Create gradient-based mask
    const gradient = createCanvasGradient(ctx, layer.maskImage, pos, size);
    if (gradient) {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Fallback: fully opaque
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Handle repeating
  if (layer.maskRepeat !== "no-repeat" && (size.width < width || size.height < height)) {
    const pattern = ctx.createPattern(canvas, getPatternRepeat(layer.maskRepeat));
    if (pattern) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
    }
  }

  return canvas;
}

function getPatternRepeat(repeat: MaskLayer["maskRepeat"]): "repeat" | "repeat-x" | "repeat-y" | "no-repeat" {
  switch (repeat) {
    case "repeat":
    case "space":
    case "round":
      return "repeat";
    case "repeat-x":
      return "repeat-x";
    case "repeat-y":
      return "repeat-y";
    default:
      return "no-repeat";
  }
}

function parseMaskSize(
  maskSize: MaskLayer["maskSize"],
  containerWidth: number,
  containerHeight: number
): { width: number; height: number } {
  const parseValue = (val: string, containerDim: number): number => {
    if (val.endsWith("%")) {
      return (parseFloat(val) / 100) * containerDim;
    }
    if (val.endsWith("px")) {
      return parseFloat(val);
    }
    if (val === "auto" || val === "cover" || val === "contain") {
      return containerDim;
    }
    return parseFloat(val) || containerDim;
  };

  return {
    width: parseValue(maskSize.width, containerWidth),
    height: parseValue(maskSize.height, containerHeight),
  };
}

function parseMaskPosition(
  maskPosition: MaskLayer["maskPosition"],
  containerWidth: number,
  containerHeight: number,
  maskWidth: number,
  maskHeight: number
): { x: number; y: number } {
  const parseValue = (val: string, containerDim: number, maskDim: number): number => {
    if (val === "center") {
      return (containerDim - maskDim) / 2;
    }
    if (val === "left" || val === "top") {
      return 0;
    }
    if (val === "right" || val === "bottom") {
      return containerDim - maskDim;
    }
    if (val.endsWith("%")) {
      const percent = parseFloat(val) / 100;
      return percent * (containerDim - maskDim);
    }
    if (val.endsWith("px")) {
      return parseFloat(val);
    }
    return parseFloat(val) || 0;
  };

  return {
    x: parseValue(maskPosition.x, containerWidth, maskWidth),
    y: parseValue(maskPosition.y, containerHeight, maskHeight),
  };
}

function createCanvasGradient(
  ctx: CanvasRenderingContext2D,
  maskImage: MaskImage,
  pos: { x: number; y: number },
  size: { width: number; height: number }
): CanvasGradient | null {
  if (maskImage.type === "url") return null;

  switch (maskImage.type) {
    case "linear-gradient":
      return createLinearGradient(ctx, maskImage, pos, size);
    case "radial-gradient":
      return createRadialGradient(ctx, maskImage, pos, size);
    case "conic-gradient":
      return createConicGradient(ctx, maskImage, pos, size);
    default:
      return null;
  }
}

function createLinearGradient(
  ctx: CanvasRenderingContext2D,
  gradient: LinearGradient,
  pos: { x: number; y: number },
  size: { width: number; height: number }
): CanvasGradient {
  // Convert CSS angle to canvas coordinates
  // CSS: 0deg = to top, 90deg = to right, 180deg = to bottom, 270deg = to left
  // We need to calculate start and end points based on the angle
  const angleRad = ((gradient.angle - 90) * Math.PI) / 180;

  const centerX = pos.x + size.width / 2;
  const centerY = pos.y + size.height / 2;

  // Calculate the gradient line length based on the angle
  // The gradient line must extend to the corners of the box
  const absCos = Math.abs(Math.cos(angleRad));
  const absSin = Math.abs(Math.sin(angleRad));
  const length = absCos * size.width + absSin * size.height;
  const halfLength = length / 2;

  const dx = Math.cos(angleRad) * halfLength;
  const dy = Math.sin(angleRad) * halfLength;

  const x1 = centerX - dx;
  const y1 = centerY - dy;
  const x2 = centerX + dx;
  const y2 = centerY + dy;

  const canvasGradient = ctx.createLinearGradient(x1, y1, x2, y2);

  addGradientStops(canvasGradient, gradient.stops);

  return canvasGradient;
}

function createRadialGradient(
  ctx: CanvasRenderingContext2D,
  gradient: RadialGradient,
  pos: { x: number; y: number },
  size: { width: number; height: number }
): CanvasGradient {
  const centerX = pos.x + (gradient.centerX / 100) * size.width;
  const centerY = pos.y + (gradient.centerY / 100) * size.height;

  // Calculate radius based on size keyword
  let radiusX: number;
  let radiusY: number;

  const toLeft = centerX - pos.x;
  const toRight = pos.x + size.width - centerX;
  const toTop = centerY - pos.y;
  const toBottom = pos.y + size.height - centerY;

  switch (gradient.sizeKeyword) {
    case "closest-side":
      radiusX = Math.min(toLeft, toRight);
      radiusY = Math.min(toTop, toBottom);
      break;
    case "farthest-side":
      radiusX = Math.max(toLeft, toRight);
      radiusY = Math.max(toTop, toBottom);
      break;
    case "closest-corner": {
      const closestX = Math.min(toLeft, toRight);
      const closestY = Math.min(toTop, toBottom);
      const dist = Math.sqrt(closestX * closestX + closestY * closestY);
      radiusX = radiusY = dist;
      break;
    }
    case "farthest-corner":
    default: {
      const farthestX = Math.max(toLeft, toRight);
      const farthestY = Math.max(toTop, toBottom);
      const dist = Math.sqrt(farthestX * farthestX + farthestY * farthestY);
      radiusX = radiusY = dist;
      break;
    }
  }

  // Canvas radial gradient only supports circles
  // For ellipses, we use the average radius and scale the context
  if (gradient.shape === "ellipse" && radiusX !== radiusY) {
    // Use the larger radius and we'll need to handle the ellipse separately
    // For simplicity, use average radius
    const avgRadius = (radiusX + radiusY) / 2;
    const canvasGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, avgRadius);
    addGradientStops(canvasGradient, gradient.stops);
    return canvasGradient;
  }

  const radius = gradient.shape === "circle" ? Math.max(radiusX, radiusY) : radiusX;
  const canvasGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

  addGradientStops(canvasGradient, gradient.stops);

  return canvasGradient;
}

function createConicGradient(
  ctx: CanvasRenderingContext2D,
  gradient: ConicGradient,
  pos: { x: number; y: number },
  size: { width: number; height: number }
): CanvasGradient | null {
  // Check if createConicGradient is supported
  if (!ctx.createConicGradient) {
    // Fallback: return a simple radial gradient approximation
    const centerX = pos.x + (gradient.centerX / 100) * size.width;
    const centerY = pos.y + (gradient.centerY / 100) * size.height;
    const radius = Math.max(size.width, size.height);
    const fallbackGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    addGradientStops(fallbackGradient, gradient.stops);
    return fallbackGradient;
  }

  const centerX = pos.x + (gradient.centerX / 100) * size.width;
  const centerY = pos.y + (gradient.centerY / 100) * size.height;

  // Convert CSS angle to canvas angle
  // CSS: 0deg = up, clockwise
  // Canvas: 0 = right, counterclockwise by default, but conic is clockwise
  const startAngle = ((gradient.fromAngle - 90) * Math.PI) / 180;

  const canvasGradient = ctx.createConicGradient(startAngle, centerX, centerY);

  addGradientStops(canvasGradient, gradient.stops);

  return canvasGradient;
}

function addGradientStops(
  canvasGradient: CanvasGradient,
  stops: { color: string; position: number; opacity: number }[]
): void {
  // Sort stops by position
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  for (const stop of sortedStops) {
    // For masks, we use the alpha channel to control transparency
    // The color's luminance/alpha determines the mask opacity
    const rgba = colorToRgba(stop.color, stop.opacity);
    canvasGradient.addColorStop(Math.max(0, Math.min(1, stop.position / 100)), rgba);
  }
}

function colorToRgba(_color: string, opacity: number): string {
  // For masks, use opacity directly as the alpha value
  // The color in gradient stops is for UI display only
  return `rgba(255, 255, 255, ${opacity})`;
}

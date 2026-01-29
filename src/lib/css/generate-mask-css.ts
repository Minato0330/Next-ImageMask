import type { MaskLayer } from "../types";
import { serializeMaskImage } from "../gradient/serialize-gradient";

const WEBKIT_COMPOSITE_MAP: Record<string, string> = {
  add: "source-over",
  subtract: "source-out",
  intersect: "source-in",
  exclude: "xor",
};

export function buildMaskStyles(layers: MaskLayer[]): Record<string, string> {
  const visible = layers.filter((l) => l.visible);
  if (visible.length === 0) return {};

  const s: Record<string, string> = {};

  s.WebkitMaskImage = visible.map((l) => serializeMaskImage(l.maskImage)).join(", ");

  const positions = visible.map((l) => `${l.maskPosition.x} ${l.maskPosition.y}`);
  if (positions.some((p) => p !== "center center")) {
    s.WebkitMaskPosition = positions.join(", ");
  }

  const sizes = visible.map((l) => `${l.maskSize.width} ${l.maskSize.height}`);
  if (sizes.some((v) => v !== "100% 100%")) {
    s.WebkitMaskSize = sizes.join(", ");
  }

  const repeats = visible.map((l) => l.maskRepeat);
  if (repeats.some((r) => r !== "no-repeat")) {
    s.WebkitMaskRepeat = repeats.join(", ");
  }

  const origins = visible.map((l) => l.maskOrigin);
  if (origins.some((o) => o !== "border-box")) {
    s.WebkitMaskOrigin = origins.join(", ");
  }

  const clips = visible.map((l) => l.maskClip);
  if (clips.some((c) => c !== "border-box")) {
    s.WebkitMaskClip = clips.join(", ");
  }

  const composites = visible.map((l) => l.maskComposite);
  if (composites.some((c) => c !== "add")) {
    s.WebkitMaskComposite = composites.map((c) => WEBKIT_COMPOSITE_MAP[c] || c).join(", ");
  }

  const modes = visible.map((l) => l.maskMode);
  if (modes.some((m) => m !== "match-source")) {
    s.WebkitMaskMode = modes.join(", ");
  }

  return s;
}

export function generateMaskCss(layers: MaskLayer[]): string {
  const visibleLayers = layers.filter((l) => l.visible);
  if (visibleLayers.length === 0) return "";

  const lines: string[] = [];

  const images = visibleLayers.map((l) => serializeMaskImage(l.maskImage));
  lines.push(`  -webkit-mask-image: ${images.join(",\n    ")};`);
  lines.push(`  mask-image: ${images.join(",\n    ")};`);

  const positions = visibleLayers.map((l) => `${l.maskPosition.x} ${l.maskPosition.y}`);
  if (positions.some((p) => p !== "center center")) {
    lines.push(`  -webkit-mask-position: ${positions.join(", ")};`);
    lines.push(`  mask-position: ${positions.join(", ")};`);
  }

  const sizes = visibleLayers.map((l) => `${l.maskSize.width} ${l.maskSize.height}`);
  if (sizes.some((s) => s !== "100% 100%")) {
    lines.push(`  -webkit-mask-size: ${sizes.join(", ")};`);
    lines.push(`  mask-size: ${sizes.join(", ")};`);
  }

  const repeats = visibleLayers.map((l) => l.maskRepeat);
  if (repeats.some((r) => r !== "no-repeat")) {
    lines.push(`  -webkit-mask-repeat: ${repeats.join(", ")};`);
    lines.push(`  mask-repeat: ${repeats.join(", ")};`);
  }

  const origins = visibleLayers.map((l) => l.maskOrigin);
  if (origins.some((o) => o !== "border-box")) {
    lines.push(`  -webkit-mask-origin: ${origins.join(", ")};`);
    lines.push(`  mask-origin: ${origins.join(", ")};`);
  }

  const clips = visibleLayers.map((l) => l.maskClip);
  if (clips.some((c) => c !== "border-box")) {
    lines.push(`  -webkit-mask-clip: ${clips.join(", ")};`);
    lines.push(`  mask-clip: ${clips.join(", ")};`);
  }

  const composites = visibleLayers.map((l) => l.maskComposite);
  if (composites.some((c) => c !== "add")) {
    lines.push(`  -webkit-mask-composite: ${composites.map((c) => WEBKIT_COMPOSITE_MAP[c] || c).join(", ")};`);
    lines.push(`  mask-composite: ${composites.join(", ")};`);
  }

  const modes = visibleLayers.map((l) => l.maskMode);
  if (modes.some((m) => m !== "match-source")) {
    lines.push(`  -webkit-mask-mode: ${modes.join(", ")};`);
    lines.push(`  mask-mode: ${modes.join(", ")};`);
  }

  return lines.join("\n");
}

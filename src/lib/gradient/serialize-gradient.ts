import type { MaskImage, GradientStop, LinearGradient, RadialGradient, ConicGradient } from "../types";

function serializeStops(stops: GradientStop[]): string {
  return stops
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => {
      const color = applyOpacity(s.color, s.opacity);
      return `${color} ${s.position}%`;
    })
    .join(", ");
}

function applyOpacity(color: string, opacity: number): string {
  if (opacity >= 1) return color;
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  if (color.startsWith("rgba(")) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
  }
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }
  return color;
}

function serializeLinear(g: LinearGradient): string {
  const prefix = g.repeating ? "repeating-linear-gradient" : "linear-gradient";
  return `${prefix}(${g.angle}deg, ${serializeStops(g.stops)})`;
}

function serializeRadial(g: RadialGradient): string {
  const prefix = g.repeating ? "repeating-radial-gradient" : "radial-gradient";
  const shape = `${g.shape} ${g.sizeKeyword}`;
  const position = `at ${g.centerX}% ${g.centerY}%`;
  return `${prefix}(${shape} ${position}, ${serializeStops(g.stops)})`;
}

function serializeConic(g: ConicGradient): string {
  const prefix = g.repeating ? "repeating-conic-gradient" : "conic-gradient";
  const from = `from ${g.fromAngle}deg`;
  const position = `at ${g.centerX}% ${g.centerY}%`;
  return `${prefix}(${from} ${position}, ${serializeStops(g.stops)})`;
}

export function serializeMaskImage(maskImage: MaskImage): string {
  switch (maskImage.type) {
    case "linear-gradient":
      return serializeLinear(maskImage);
    case "radial-gradient":
      return serializeRadial(maskImage);
    case "conic-gradient":
      return serializeConic(maskImage);
    case "url":
      return `url(${maskImage.url})`;
  }
}

import type { ClipPath } from "../types";

export function buildClipPathValue(clipPath: ClipPath): string {
  switch (clipPath.type) {
    case "none":
      return "";
    case "circle":
      return `circle(${clipPath.radius}% at ${clipPath.centerX}% ${clipPath.centerY}%)`;
    case "ellipse":
      return `ellipse(${clipPath.radiusX}% ${clipPath.radiusY}% at ${clipPath.centerX}% ${clipPath.centerY}%)`;
    case "inset": {
      const br = clipPath.borderRadius > 0 ? ` round ${clipPath.borderRadius}%` : "";
      return `inset(${clipPath.top}% ${clipPath.right}% ${clipPath.bottom}% ${clipPath.left}%${br})`;
    }
    case "polygon": {
      const points = clipPath.points.map((p) => `${p.x}% ${p.y}%`).join(", ");
      return `polygon(${points})`;
    }
    case "custom":
      return clipPath.value || "";
  }
}

export function generateClipPathCss(clipPath: ClipPath): string {
  const value = buildClipPathValue(clipPath);
  if (!value) return "";
  return `  clip-path: ${value};`;
}

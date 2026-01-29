import type { StudioState } from "../types";
import type { ExportSettings } from "../types";
import { buildFilterValue } from "../css/generate-filter-css";
import { buildClipPathValue } from "../css/generate-clip-path-css";
import { buildMaskStyles } from "../css/generate-mask-css";
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

  const maskStyles = buildMaskStyles(state.maskLayers);
  for (const [key, value] of Object.entries(maskStyles)) {
    const cssProperty = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    imgEl.style.setProperty(cssProperty, value);
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
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${imgEl.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const svgImg = await loadImage(svgUrl);
      ctx.drawImage(svgImg, 0, 0);
    } catch {
      ctx.drawImage(img, 0, 0, width, height);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
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

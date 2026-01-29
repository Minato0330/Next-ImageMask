"use client";

import { useMemo } from "react";
import { useStudioStore } from "@/hooks/use-studio-store";
import { buildFilterValue } from "@/lib/css/generate-filter-css";
import { buildClipPathValue } from "@/lib/css/generate-clip-path-css";
import { buildMaskStyles } from "@/lib/css/generate-mask-css";

export function ImagePreview() {
  const image = useStudioStore((s) => s.image);
  const filters = useStudioStore((s) => s.filters);
  const blendMode = useStudioStore((s) => s.blendMode);
  const clipPath = useStudioStore((s) => s.clipPath);
  const maskLayers = useStudioStore((s) => s.maskLayers);

  const style = useMemo<React.CSSProperties>(() => {
    if (!image) return {};

    const s: React.CSSProperties = {
      maxWidth: "100%",
      maxHeight: "70vh",
      display: "block",
    };

    const filterValue = buildFilterValue(filters);
    if (filterValue) {
      s.filter = filterValue;
    }

    if (blendMode !== "normal") {
      s.mixBlendMode = blendMode as React.CSSProperties["mixBlendMode"];
    }

    const clipPathValue = buildClipPathValue(clipPath);
    if (clipPathValue) {
      s.clipPath = clipPathValue;
    }

    const maskStyles = buildMaskStyles(maskLayers);
    Object.assign(s, maskStyles);

    return s;
  }, [image, filters, blendMode, clipPath, maskLayers]);

  if (!image) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.fileName}
      style={style}
      draggable={false}
    />
  );
}

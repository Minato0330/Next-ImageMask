"use client";

import type { MaskLayer, MaskImage } from "@/lib/types";
import { useStudioStore } from "@/hooks/use-studio-store";
import { PanelSection } from "@/components/shared/panel-section";
import { LabeledSelect } from "@/components/shared/labeled-select";
import { PositionInput } from "@/components/shared/position-input";
import { SizeInput } from "@/components/shared/size-input";
import { GradientBuilder } from "./gradient-builder";
import {
  MASK_REPEAT_OPTIONS,
  MASK_ORIGIN_OPTIONS,
  MASK_CLIP_OPTIONS,
  MASK_COMPOSITE_OPTIONS,
  MASK_MODE_OPTIONS,
} from "@/lib/constants";
import { Input } from "@/components/ui/input";

interface MaskLayerEditorProps {
  layer: MaskLayer;
}

export function MaskLayerEditor({ layer }: MaskLayerEditorProps) {
  const updateMaskLayerAction = useStudioStore((s) => s.updateMaskLayer);
  const updateMaskImageAction = useStudioStore((s) => s.updateMaskImage);

  const updateLayer = (changes: Partial<MaskLayer>) => {
    updateMaskLayerAction(layer.id, changes);
  };

  const updateMaskImage = (maskImage: MaskImage) => {
    updateMaskImageAction(layer.id, maskImage);
  };

  return (
    <div className="space-y-2">
      <PanelSection title="Mask Image">
        {layer.maskImage.type === "url" ? (
          <div className="space-y-2.5">
            <LabeledSelect
              label="Type"
              value="url"
              options={["linear-gradient", "radial-gradient", "conic-gradient", "url"]}
              onChange={(v) => {
                if (v === "url") return;
                updateMaskImage({
                  type: v as "linear-gradient",
                  angle: 180,
                  stops: [
                    { id: "1", color: "#000000", position: 0, opacity: 1 },
                    { id: "2", color: "#000000", position: 100, opacity: 0 },
                  ],
                  repeating: false,
                } as MaskImage);
              }}
            />
            <div className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[13px] text-muted-foreground">URL</span>
              <Input
                value={layer.maskImage.url}
                onChange={(e) => updateMaskImage({ type: "url", url: e.target.value })}
                className="h-8 flex-1 font-mono text-xs"
                placeholder="url(...)"
              />
            </div>
          </div>
        ) : (
          <GradientBuilder
            gradient={layer.maskImage}
            onChange={updateMaskImage}
          />
        )}
      </PanelSection>

      <PanelSection title="Position & Size" defaultOpen={false}>
        <div className="space-y-2.5">
          <PositionInput
            label="Position"
            x={layer.maskPosition.x}
            y={layer.maskPosition.y}
            onChangeX={(x) => updateLayer({ maskPosition: { ...layer.maskPosition, x } })}
            onChangeY={(y) => updateLayer({ maskPosition: { ...layer.maskPosition, y } })}
          />
          <SizeInput
            label="Size"
            width={layer.maskSize.width}
            height={layer.maskSize.height}
            onChangeWidth={(width) => updateLayer({ maskSize: { ...layer.maskSize, width } })}
            onChangeHeight={(height) => updateLayer({ maskSize: { ...layer.maskSize, height } })}
          />
        </div>
      </PanelSection>

      <PanelSection title="Properties" defaultOpen={false}>
        <div className="space-y-2.5">
          <LabeledSelect
            label="Repeat"
            value={layer.maskRepeat}
            options={MASK_REPEAT_OPTIONS}
            onChange={(v) => updateLayer({ maskRepeat: v as MaskLayer["maskRepeat"] })}
          />
          <LabeledSelect
            label="Origin"
            value={layer.maskOrigin}
            options={MASK_ORIGIN_OPTIONS}
            onChange={(v) => updateLayer({ maskOrigin: v as MaskLayer["maskOrigin"] })}
          />
          <LabeledSelect
            label="Clip"
            value={layer.maskClip}
            options={MASK_CLIP_OPTIONS}
            onChange={(v) => updateLayer({ maskClip: v as MaskLayer["maskClip"] })}
          />
          <LabeledSelect
            label="Composite"
            value={layer.maskComposite}
            options={MASK_COMPOSITE_OPTIONS}
            onChange={(v) => updateLayer({ maskComposite: v as MaskLayer["maskComposite"] })}
          />
          <LabeledSelect
            label="Mode"
            value={layer.maskMode}
            options={MASK_MODE_OPTIONS}
            onChange={(v) => updateLayer({ maskMode: v as MaskLayer["maskMode"] })}
          />
        </div>
      </PanelSection>
    </div>
  );
}

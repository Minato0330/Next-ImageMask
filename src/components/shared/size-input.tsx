"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SizeInputProps {
  label: string;
  width: string;
  height: string;
  onChangeWidth: (value: string) => void;
  onChangeHeight: (value: string) => void;
}

const SIZE_KEYWORDS = ["auto", "cover", "contain"];

export function SizeInput({ label, width, height, onChangeWidth, onChangeHeight }: SizeInputProps) {
  const isWidthKeyword = SIZE_KEYWORDS.includes(width);
  const isHeightKeyword = SIZE_KEYWORDS.includes(height);

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-[13px] text-muted-foreground">{label}</span>
      <div className="flex flex-1 items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground">W</span>
        {isWidthKeyword ? (
          <Select value={width} onValueChange={onChangeWidth}>
            <SelectTrigger className="h-8 flex-1 text-xs" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_KEYWORDS.map((k) => (
                <SelectItem key={k} value={k} className="text-xs">
                  {k}
                </SelectItem>
              ))}
              <SelectItem value="100%" className="text-xs">
                custom
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={width}
            onChange={(e) => onChangeWidth(e.target.value)}
            className="h-8 flex-1 font-mono text-xs"
          />
        )}

        <span className="text-[11px] text-muted-foreground">H</span>
        {isHeightKeyword ? (
          <Select value={height} onValueChange={onChangeHeight}>
            <SelectTrigger className="h-8 flex-1 text-xs" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_KEYWORDS.map((k) => (
                <SelectItem key={k} value={k} className="text-xs">
                  {k}
                </SelectItem>
              ))}
              <SelectItem value="100%" className="text-xs">
                custom
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={height}
            onChange={(e) => onChangeHeight(e.target.value)}
            className="h-8 flex-1 font-mono text-xs"
          />
        )}
      </div>
    </div>
  );
}

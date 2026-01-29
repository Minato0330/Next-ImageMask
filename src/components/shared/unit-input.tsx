"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnitInputProps {
  label: string;
  value: number;
  unit: string;
  units?: string[];
  onChange: (value: number) => void;
  onUnitChange?: (unit: string) => void;
  min?: number;
  max?: number;
}

export function UnitInput({
  label,
  value,
  unit,
  units = ["px", "%"],
  onChange,
  onUnitChange,
  min,
  max,
}: UnitInputProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-xs text-muted-foreground">{label}</span>
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-7 flex-1 font-mono text-xs"
      />
      {onUnitChange ? (
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger className="h-7 w-14 text-xs" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u} value={u} className="text-xs">
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="text-xs text-muted-foreground">{unit}</span>
      )}
    </div>
  );
}

import type { LinearGradient, GradientStop } from "../types";
import { generateId } from "../store/initial-state";

export function createGradientStops(
  colors: [string, number][]
): GradientStop[] {
  return colors.map(([color, position]) => ({
    id: generateId(),
    color,
    position,
    opacity: 1,
  }));
}

export function createLinearGradient(
  angle: number,
  stops: [string, number][],
  repeating = false
): LinearGradient {
  return {
    type: "linear-gradient",
    angle,
    stops: createGradientStops(stops),
    repeating,
  };
}

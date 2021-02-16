import { ColorName, colors } from "app/data/colors.db";

export type { ColorName, ColorData, Color } from "app/data/colors.db";

export function getColor(name: ColorName | null) {
  if (!name) {
    return;
  }
  return colors[name];
}

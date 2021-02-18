import { ColorName, colors } from "app/data/colors.db";
import memoize from "lodash/memoize";

export type { ColorName, ColorData, Color } from "app/data/colors.db";

export function getColor(name: ColorName | null) {
  if (!name) {
    return;
  }
  return colors[name];
}

export const getAllColorNames = memoize(
  () => Object.keys(colors).sort() as ColorName[]
);

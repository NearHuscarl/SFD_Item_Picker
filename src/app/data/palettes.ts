import { PaletteName, palettes } from "app/data/palettes.db";

export type { PaletteName, Palette } from "app/data/palettes.db";

export function getPalette(name: PaletteName) {
  return palettes[name];
}

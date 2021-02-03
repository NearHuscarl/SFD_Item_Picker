// this file is auto generated. Do not touch.
import { PaletteName } from "./palettes";

export type Item = {
  gameName: string;
  fileName: ItemID;
  equipmentLayer: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  jacketUnderBelt: boolean;
  canEquip: boolean;
  canScript: boolean;
  colorPalette: PaletteName;
  data: number[][];
};

export const items: Record<ItemID, Item> = __ITEMS__;

export type ItemID = __ITEM_ID__;

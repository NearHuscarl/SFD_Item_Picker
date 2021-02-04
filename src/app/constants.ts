import invert from "lodash/invert";
import { Layer, Type } from "app/types";

export const __DEV__ = process.env.NODE_ENV === "development";
export const __PRODUCTION__ = process.env.NODE_ENV === "production";

export const TEXTURE_WIDTH = 16;
export const TEXTURE_HEIGHT = 16;

export const ItemPartTypeValue = {
  Head: 0,
  Body: 1,
  Arm: 2,
  Fist: 3,
  Legs: 4,
  Tail: 5,
} as const;
export const ItemPartType = invert(ItemPartTypeValue) as Record<number, Type>;

export const LayerValue = {
  Skin: 0,
  ChestUnder: 1,
  Legs: 2,
  Waist: 3,
  Feet: 4,
  ChestOver: 5,
  Accessory: 6,
  Hands: 7,
  Head: 8,
} as const;

export const Layers = invert(LayerValue) as Record<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
  Layer
>;

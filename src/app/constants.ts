import invert from "lodash/invert";
import { Layer, Type } from "app/types";

export const __DEV__ = process.env.NODE_ENV === "development";
export const __PRODUCTION__ = process.env.NODE_ENV === "production";

export const Genders = {
  male: 0,
  female: 1,
  both: 2,
} as const;

export const COLOR_TYPES = ["primary", "secondary", "tertiary"] as const;

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
  skin: 0,
  chestUnder: 1,
  legs: 2,
  waist: 3,
  feet: 4,
  chestOver: 5,
  accessory: 6,
  hands: 7,
  head: 8,
} as const;

export const Layers = invert(LayerValue) as Record<number, Layer>;

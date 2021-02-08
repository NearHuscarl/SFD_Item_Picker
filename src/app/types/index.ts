import { LayerValue, ItemPartTypeValue, COLOR_TYPES } from "app/constants";
import { ColorName } from "app/data/colors";

export type Layer = keyof typeof LayerValue;
export type Type = keyof typeof ItemPartTypeValue;

export type Shade = 0 | 1 | 2;
export type ColorType = typeof COLOR_TYPES[number];

export type ItemColor = [
  primary: ColorName | null,
  secondary: ColorName | null,
  tertiery: ColorName | null
];

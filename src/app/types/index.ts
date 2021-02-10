import { LayerValue, ItemPartTypeValue, COLOR_TYPES } from "app/constants";
import { ColorName } from "app/data/colors";
import { Gender, ItemID } from "app/data/items";

export type Layer = keyof typeof LayerValue;
export type Type = keyof typeof ItemPartTypeValue;

export type Shade = 0 | 1 | 2;
export type ColorType = typeof COLOR_TYPES[number];

export type ItemColor = [
  primary: ColorName | null,
  secondary: ColorName | null,
  tertiery: ColorName | null
];

export type ProfileSettings = {
  name: string;
  gender: Gender;
  skin: ItemID;
  skinColors: ItemColor;
  head: ItemID;
  headColors: ItemColor;
  chestOver: ItemID;
  chestOverColors: ItemColor;
  chestUnder: ItemID;
  chestUnderColors: ItemColor;
  hands: ItemID;
  handsColors: ItemColor;
  waist: ItemID;
  waistColors: ItemColor;
  legs: ItemID;
  legsColors: ItemColor;
  feet: ItemID;
  feetColors: ItemColor;
  accessory: ItemID;
  accessoryColors: ItemColor;
};

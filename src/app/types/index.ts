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

export type ProfileItemSettings = {
  id: ItemID;
  colors: ItemColor;
};

export type ProfileSettings = {
  name: string;
  gender: Gender;
  skin: ProfileItemSettings;
  head: ProfileItemSettings;
  chestOver: ProfileItemSettings;
  chestUnder: ProfileItemSettings;
  hands: ProfileItemSettings;
  waist: ProfileItemSettings;
  legs: ProfileItemSettings;
  feet: ProfileItemSettings;
  accessory: ProfileItemSettings;
};

export type ProfileData = {
  ID: number;
  groupID: string;
  profile: ProfileSettings;
  isSelected: boolean;
};

export type ProfileGroup = {
  ID: string;
  profiles: number[];
};

export type ProfileRecords = Record<number, ProfileData>;
export type ProfileGroupRecords = Record<string, ProfileGroup>;

export type MenuData = {
  name: string;
  onClick: () => void;
};

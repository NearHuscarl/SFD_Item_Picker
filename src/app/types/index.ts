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
  ID: ProfileID;
  groupID: GroupID;
  profile: ProfileSettings;
  isSelected: boolean;
};

export type ProfileGroup = {
  ID: GroupID;
  name: string;
  profiles: number[];
  isVisible: boolean;
};

export type ProfileID = number;
export type GroupID = number;

export type ProfileRecords = Record<ProfileID, ProfileData>;
export type ProfileGroupRecords = Record<GroupID, ProfileGroup>;

export type MenuData = {
  name: string;
  onClick: () => void;
};

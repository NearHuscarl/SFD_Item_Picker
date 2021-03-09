import { Genders } from "app/constants";
import {
  ColorType,
  ItemColor,
  Layer,
  ProfileID,
  ProfileSettings,
  ProfileSettingsDraft,
} from "app/types";
import { forEachLayer } from "app/helpers";
import { ItemID } from "app/data/items";
import { ColorName } from "app/data/colors";

export interface EditorState {
  ID: ProfileID;
  draft: ProfileSettings;
  draftUnconfirmed: ProfileSettingsDraft;
  isDirty: boolean;
  isValid: boolean;
}

export type ItemParams = { layer: Layer; id: ItemID };
export type ColorParams = {
  layer: Layer;
  type: ColorType;
  name: ColorName | null;
};
export type SetItemColorParams = {
  layer: Layer;
  itemColor: ItemColor;
};

export function setName(state: EditorState, name: string) {
  state.draft.name = name;
  state.isDirty = true;
  state.isValid = Boolean(state.draft.name);
}

export function setAllItems(
  state: EditorState,
  profile: Partial<ProfileSettings> | undefined
) {
  if (profile) {
    if (profile.name) {
      setName(state, profile.name);
    }
    if (profile.gender !== undefined) {
      state.draft.gender = profile.gender;
    }

    forEachLayer((layer) => {
      if (profile[layer]) {
        state.draft[layer] = profile[layer]!;
      }
    });
  } else {
    const isMale = state.draft.gender === Genders.male;
    const profile = {
      ...(isMale ? defaultProfile.male : defaultProfile.female),
      name: undefined,
    };
    setAllItems(state, profile);
  }

  state.isDirty = true;
}

export const defaultProfile: Record<"male" | "female", ProfileSettings> = {
  male: {
    name: "BOT",
    gender: Genders.male,
    skin: { id: "Normal", colors: ["Skin3", null, null] },
    head: { id: "None", colors: [null, null, null] },
    chestOver: { id: "None", colors: [null, null, null] },
    chestUnder: {
      id: "SleevelessShirt",
      colors: ["ClothingLightGray", null, null],
    },
    hands: { id: "None", colors: [null, null, null] },
    waist: { id: "None", colors: [null, null, null] },
    legs: { id: "PantsBlack", colors: ["ClothingBlue", null, null] },
    feet: { id: "ShoesBlack", colors: ["ClothingBrown", null, null] },
    accessory: { id: "None", colors: [null, null, null] },
  },
  female: {
    name: "BOT",
    gender: Genders.female,
    skin: { id: "Normal_fem", colors: ["Skin3", null, null] },
    head: { id: "None", colors: [null, null, null] },
    chestOver: { id: "None", colors: [null, null, null] },
    chestUnder: {
      id: "SleevelessShirt_fem",
      colors: ["ClothingLightGray", null, null],
    },
    hands: { id: "None", colors: [null, null, null] },
    waist: { id: "None", colors: [null, null, null] },
    legs: { id: "PantsBlack_fem", colors: ["ClothingBlue", null, null] },
    feet: { id: "ShoesBlack", colors: ["ClothingBrown", null, null] },
    accessory: { id: "None", colors: [null, null, null] },
  },
};

export const defaultDraft: ProfileSettingsDraft = {
  skin: { id: "None", colors: [null, null, null] },
  head: { id: "None", colors: [null, null, null] },
  chestOver: { id: "None", colors: [null, null, null] },
  chestUnder: { id: "None", colors: [null, null, null] },
  hands: { id: "None", colors: [null, null, null] },
  waist: { id: "None", colors: [null, null, null] },
  legs: { id: "None", colors: [null, null, null] },
  feet: { id: "None", colors: [null, null, null] },
  accessory: { id: "None", colors: [null, null, null] },
};

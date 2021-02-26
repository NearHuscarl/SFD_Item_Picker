import { Genders } from "app/constants";
import { ProfileSettings } from "app/types";
import { forEachLayer } from "app/helpers";

export interface ProfileState {
  current: ProfileSettings;
  isDirty: boolean;
  isValid: boolean;
}

export function setName(state: ProfileState, name: string) {
  state.current.name = name;
  state.isDirty = true;
  state.isValid = Boolean(state.current.name);
}

export function setAllItems(
  state: ProfileState,
  profile: Partial<ProfileSettings> | undefined
) {
  if (profile) {
    if (profile.name) {
      setName(state, profile.name);
    }
    if (profile.gender !== undefined) {
      state.current.gender = profile.gender;
    }

    forEachLayer((layer) => {
      if (profile[layer]) {
        // TODO: optimize, don't emit all events every time
        // @ts-ignore
        state.current[layer] = profile[layer];
      }
    });
  } else {
    const isMale = state.current.gender === Genders.male;
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
    chestUnder: { id: "SleevelessShirt", colors: [null, null, null] },
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
    chestUnder: { id: "SleevelessShirt_fem", colors: [null, null, null] },
    hands: { id: "None", colors: [null, null, null] },
    waist: { id: "None", colors: [null, null, null] },
    legs: { id: "PantsBlack_fem", colors: ["ClothingBlue", null, null] },
    feet: { id: "ShoesBlack", colors: ["ClothingBrown", null, null] },
    accessory: { id: "None", colors: [null, null, null] },
  },
};

import { Genders } from "app/constants";
import { ProfileSettings } from "app/types";

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

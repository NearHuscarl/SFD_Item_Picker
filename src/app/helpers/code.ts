import { ProfileItemSettings, ProfileSettings } from "app/types";
import { Gender, ItemID } from "app/data/items";
import { ColorName } from "app/data/colors";

type IProfileField =
  | "Skin"
  | "Head"
  | "ChestOver"
  | "ChestUnder"
  | "Hands"
  | "Waist"
  | "Legs"
  | "Feet"
  | "Accesory"; // yes, it's a typo from SFD GameScript

function getIProfileConstructorRegex(field: IProfileField) {
  return new RegExp(
    `${field}\\s*=\\s*new IProfileClothingItem\\s*\\(\\s*"(\\w+)"(\\s*,\\s*"\\w+")?(\\s*,\\s*"\\w+")?(\\s*,\\s*"\\w+")?`
  );
}

function parseItem(code: string, field: IProfileField): ProfileItemSettings {
  const match = code.match(getIProfileConstructorRegex(field));

  if (!match) {
    return { id: "None", colors: [null, null, null] };
  }

  return {
    id: match[1] as ItemID,
    colors: [
      (match[2].match(/"(\w+)"/)?.[1] as ColorName) || null,
      (match[3].match(/"(\w+)"/)?.[1] as ColorName) || null,
      null,
    ],
  };
}

function parseName(code: string) {
  return code.match(/Name\s*=\s*"(.*?)"/)?.[1] || "";
}

function parseGender(code: string): Gender {
  const isFemale = Boolean(code.match(/Gender\s*=\s*Gender\.Female/));

  if (isFemale) {
    return 1;
  }
  return 0;
}

export function parseProfile(code: string): ProfileSettings {
  return {
    name: parseName(code),
    gender: parseGender(code),
    skin: parseItem(code, "Skin"),
    head: parseItem(code, "Head"),
    chestOver: parseItem(code, "ChestOver"),
    chestUnder: parseItem(code, "ChestUnder"),
    hands: parseItem(code, "Hands"),
    waist: parseItem(code, "Waist"),
    legs: parseItem(code, "Legs"),
    feet: parseItem(code, "Feet"),
    accessory: parseItem(code, "Accesory"),
  };
}

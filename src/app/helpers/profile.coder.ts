import { ItemColor, ProfileSettings } from "app/types";
import { Genders } from "app/constants";
import { Gender, getItemIDs, ItemID } from "app/data/items";
import { createBaseConverter } from "app/helpers/createBaseConverter";
import { ColorName, getAllColorNames } from "app/data/colors";
import { forEachLayer } from "app/helpers/index";

const NULL_ITEM_CODE = "Y";
const NULL_COLOR_CODE = "Z";

// Unused characters that can be used when adding extra encoding in the future: ~+/,_
// Make sure the characters won't be encoded in url params
// https://stackoverflow.com/questions/1455578/characters-allowed-in-get-parameter
const ALL_DIGITS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX";
// 26 * 2 + 10 - 2 = 60
const base60 = createBaseConverter(ALL_DIGITS);

function createGenderCoder() {
  return {
    encode: (gender: Gender): "F" | "M" => {
      return gender === Genders.female ? "F" : "M";
    },
    decode: (str: string): Gender => {
      if (str !== "M" && str !== "F") {
        throw new Error(`${str} is not a valid encoded Gender`);
      }
      return str === "F" ? Genders.female : Genders.male;
    },
  };
}

function createItemCoder() {
  const allIDs = getItemIDs();
  // @ts-ignore
  const encodeMap: Record<ItemID, string> = {};
  const decodeMap: Record<string, ItemID> = {};

  // each itemID is stored in fixed size string of 2 (64 characters)
  // can encode up to 60x60 = 3600 items. There are currently over 200 items
  allIDs.forEach((id, i) => {
    const base60Index = base60.fromNumber(i).padStart(2, "0");
    encodeMap[id] = base60Index;
    decodeMap[base60Index] = id;
  });

  return {
    encode: (item: ItemID) => {
      if (item === "None") {
        return NULL_ITEM_CODE;
      }
      return encodeMap[item];
    },
    decode: (base60Index: string): ItemID => {
      if (base60Index === NULL_ITEM_CODE) {
        return "None";
      }
      const decoded = decodeMap[base60Index];
      if (decoded === undefined) {
        throw new Error(`${base60Index} is not a valid encoded Item`);
      }
      return decoded;
    },
  };
}

function createColorCoder() {
  const allColorNames = getAllColorNames();
  // @ts-ignore
  const encodeMap: Record<ColorName, string> = {};
  const decodeMap: Record<string, ColorName> = {};

  // there are 37 color names, so they can all fit in 1 character index (base 64)
  allColorNames.forEach((id, i) => {
    const base60Index = base60.fromNumber(i);
    encodeMap[id] = base60Index;
    decodeMap[base60Index] = id;
  });

  return {
    encode: (name: ColorName | null) => {
      if (name === null) {
        return NULL_COLOR_CODE;
      }
      return encodeMap[name];
    },
    decode: (base60Index: string): ColorName | null => {
      if (base60Index === NULL_COLOR_CODE) {
        return null;
      }
      const decoded = decodeMap[base60Index];
      if (decoded === undefined) {
        throw new Error(`${base60Index} is not a valid encoded Color`);
      }
      return decoded;
    },
  };
}

function createItemColorCoder() {
  return {
    encode: (itemColor: ItemColor) => {
      const encoded1 = colorCoder.encode(itemColor[0]);
      const encoded2 = colorCoder.encode(itemColor[1]);
      return encoded1 + encoded2;
    },
    decode: (encoded: string): ItemColor => {
      const [encoded1, encoded2] = encoded.split("");
      return [colorCoder.decode(encoded1), colorCoder.decode(encoded2), null];
    },
  };
}

const genderCoder = createGenderCoder();
const itemCoder = createItemCoder();
const colorCoder = createColorCoder();
const itemColorCoder = createItemColorCoder();

function createScanner(str: string) {
  return {
    next: (num = 1) => {
      const nextStr = str.slice(0, num);
      str = str.slice(num, str.length);
      return nextStr;
    },
  };
}

export function encodeProfile(profile: ProfileSettings) {
  let encodedText = "";

  encodedText += genderCoder.encode(profile.gender);

  forEachLayer((layer) => {
    const itemId = profile[layer].id;
    const itemColors = profile[layer].colors;

    // console.log("encode", itemId, "->", itemCoder.encode(itemId));

    encodedText += itemCoder.encode(itemId);
    if (itemId !== "None") {
      // console.log(
      //   "encode",
      //   itemColors,
      //   "->",
      //   itemColorCoder.encode(itemColors)
      // );
      encodedText += itemColorCoder.encode(itemColors);
    }
  });

  return encodedText;
}

export function decodeProfile(urlParams: string) {
  // @ts-ignore
  const profile: ProfileSettings = {};
  const scanner = createScanner(urlParams);

  profile.gender = genderCoder.decode(scanner.next());

  forEachLayer((layer) => {
    const firstChar = scanner.next();
    if (firstChar === NULL_ITEM_CODE) {
      profile[layer] = {
        id: "None",
        colors: [null, null, null],
      };
      // console.log("decode", firstChar, "->", "None");
    } else {
      const encodedItem = firstChar + scanner.next();
      const encodedItemColor = scanner.next(2);

      profile[layer] = {
        id: itemCoder.decode(encodedItem),
        colors: itemColorCoder.decode(encodedItemColor),
      };

      // console.log("decode", encodedItem, "->", profile[layer].id);
      // console.log("decode", encodedItemColor, "->", profile[layer].colors);
    }
  });

  return profile;
}

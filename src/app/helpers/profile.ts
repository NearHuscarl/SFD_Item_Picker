import { ItemColor, ProfileSettings } from "app/types";
import { Genders } from "app/constants";
import { Gender, getItemIDs, ItemID } from "app/data/items";
import { radix64 } from "app/helpers/radix64";
import { ColorName, getAllColorNames } from "app/data/colors";
import { forEachLayer, isArrayEqual } from "app/helpers/index";

const NULL_ITEM_CODE = "_";
const NULL_COLOR_CODE = "Z";

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
  // can encode up to 64x64 = 4096 items
  allIDs.forEach((id, i) => {
    const radix64Index = radix64.fromNumber(i).padStart(2, "0");
    encodeMap[id] = radix64Index;
    decodeMap[radix64Index] = id;
  });

  return {
    encode: (item: ItemID) => {
      if (item === "None") {
        return NULL_ITEM_CODE;
      }
      return encodeMap[item];
    },
    decode: (radix64Index: string): ItemID => {
      if (radix64Index === NULL_ITEM_CODE) {
        return "None";
      }
      const decoded = decodeMap[radix64Index];
      if (decoded === undefined) {
        throw new Error(`${radix64Index} is not a valid encoded Item`);
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
    const radix64Index = radix64.fromNumber(i);
    encodeMap[id] = radix64Index;
    decodeMap[radix64Index] = id;
  });

  return {
    encode: (name: ColorName | null) => {
      if (name === null) {
        return NULL_COLOR_CODE;
      }
      return encodeMap[name];
    },
    decode: (radix64Index: string): ColorName | null => {
      if (radix64Index === NULL_COLOR_CODE) {
        return null;
      }
      const decoded = decodeMap[radix64Index];
      if (decoded === undefined) {
        throw new Error(`${radix64Index} is not a valid encoded Color`);
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

export function isProfileEqual(
  profile1: ProfileSettings,
  profile2: ProfileSettings
) {
  return (
    profile1.name === profile2.name &&
    profile1.gender === profile2.gender &&
    profile1.skin.id === profile2.skin.id &&
    isArrayEqual(profile1.skin.colors, profile2.skin.colors) &&
    profile1.chestUnder.id === profile2.chestUnder.id &&
    isArrayEqual(profile1.chestUnder.colors, profile2.chestUnder.colors) &&
    profile1.legs.id === profile2.legs.id &&
    isArrayEqual(profile1.legs.colors, profile2.legs.colors) &&
    profile1.waist.id === profile2.waist.id &&
    isArrayEqual(profile1.waist.colors, profile2.waist.colors) &&
    profile1.feet.id === profile2.feet.id &&
    isArrayEqual(profile1.feet.colors, profile2.feet.colors) &&
    profile1.chestOver.id === profile2.chestOver.id &&
    isArrayEqual(profile1.chestOver.colors, profile2.chestOver.colors) &&
    profile1.accessory.id === profile2.accessory.id &&
    isArrayEqual(profile1.accessory.colors, profile2.accessory.colors) &&
    profile1.hands.id === profile2.hands.id &&
    isArrayEqual(profile1.hands.colors, profile2.hands.colors) &&
    profile1.head.id === profile2.head.id &&
    isArrayEqual(profile1.head.colors, profile2.head.colors)
  );
}

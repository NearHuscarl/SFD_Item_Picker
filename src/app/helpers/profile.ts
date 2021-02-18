import camelCase from "lodash/camelCase";
import { ItemColor, ProfileSettings } from "app/types";
import { Genders } from "app/constants";
import { Gender, getItemIDs, ItemID } from "app/data/items";
import { radix64 } from "app/helpers/radix64";
import { ColorName, getAllColorNames } from "app/data/colors";
import { forEachLayer } from "app/helpers/index";

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
    const getter = camelCase(layer);
    const colorGetter = camelCase(layer) + "Colors";
    // console.log(
    //   "encode",
    //   profile[getter],
    //   "->",
    //   itemCoder.encode(profile[getter])
    // );

    encodedText += itemCoder.encode(profile[getter]);
    if (profile[getter] !== "None") {
      // console.log(
      //   "encode",
      //   profile[colorGetter],
      //   "->",
      //   itemColorCoder.encode(profile[colorGetter])
      // );
      encodedText += itemColorCoder.encode(profile[colorGetter]);
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
    const getter = camelCase(layer);
    const colorGetter = camelCase(layer) + "Colors";

    const firstChar = scanner.next();
    if (firstChar === NULL_ITEM_CODE) {
      profile[getter] = "None";
      // console.log("decode", firstChar, "->", "None");
    } else {
      const encodedItem = firstChar + scanner.next();
      const encodedItemColor = scanner.next(2);

      profile[getter] = itemCoder.decode(encodedItem);
      profile[colorGetter] = itemColorCoder.decode(encodedItemColor);

      // console.log("decode", encodedItem, "->", profile[getter]);
      // console.log("decode", encodedItemColor, "->", profile[colorGetter]);
    }
  });

  return profile;
}

import memoize from "lodash/memoize";
import { Item, Gender, ItemID, getItem, getItemIDs } from "app/data/items";
import { ColorType, ItemColor, Layer, Type } from "app/types";
import {
  COLOR_TYPES,
  ItemPartType,
  ItemPartTypeValue,
  LayerValue,
} from "app/constants";
import { getPalette } from "app/data/palettes";
import { ColorName } from "app/data/colors";
import { getMainColor } from "app/helpers/color";
import { forEachColorType } from "app/helpers/index";

function forEachItem(fn: (item: Item, index: number) => void) {
  getItemIDs().forEach((id, i) => {
    fn(getItem(id), i);
  });
}

export const getItems = memoize(
  (layer: Layer, gender: Gender) => {
    const result: Item[] = [];

    forEachItem((item) => {
      if (
        item.id !== "None" &&
        item.equipmentLayer === LayerValue[layer] &&
        (item.gender === gender || getGender(item) === "both")
      ) {
        result.push(item);
      }
    });

    return result;
  },
  (layer, gender) => `${layer}_${gender}`
);

export function getGender(item: Item): "male" | "female" | "both" {
  switch (item.gender) {
    case 0:
      return "male";
    case 1:
      return "female";
    case 2:
      return "both";
  }
}

export function hasColor(item: Item, colorType: ColorType) {
  return item.colorSlot[COLOR_TYPES.indexOf(colorType)];
}

export function getMainColors(item: Item, colorType: ColorType) {
  return getPalette(item.colorPalette)[colorType].map((name) => {
    return {
      name,
      color: getMainColor(name)!,
    };
  });
}

export function getDefaultColorName(item: Item, colorType: ColorType) {
  if (!hasColor(item, colorType)) {
    return;
  }
  return getPalette(item.colorPalette)[colorType][0];
}

export function getTextureKeys(itemID: ItemID) {
  const { fileName, data } = getItem(itemID);
  const result: string[][] = [];

  (Object.keys(ItemPartTypeValue) as Type[]).forEach((typeStr) => {
    const type = ItemPartTypeValue[typeStr];
    const localIds = data[type];

    result[type] = [];

    localIds.forEach((localId) => {
      result[type][localId] = `${fileName}_${type}_${localId}`;
    });
  });

  return result;
}

export function globalIdToType(globalID: number) {
  return Math.floor(globalID / 50);
}

export function globalIdToLocalId(globalID: number) {
  return Math.abs(globalID % 50);
}

export function validateColorName(
  item: Item,
  colorType: ColorType,
  colorName: ColorName | null
) {
  if (!colorName) {
    return false;
  }

  const palette = getPalette(item.colorPalette);
  return !!palette[colorType].find((c) => c === colorName);
}

export function getValidItemColor(item: Item, currentItemColor: ItemColor) {
  const itemColor = [...currentItemColor] as ItemColor;

  forEachColorType((type, i) => {
    if (itemColor[i] && !hasColor(item, type)) {
      itemColor[i] = null;
    }
    if (!validateColorName(item, type, itemColor[i])) {
      itemColor[i] = getDefaultColorName(item, type) || null;
    }
    if (!itemColor[i] && hasColor(item, type)) {
      itemColor[i] = getDefaultColorName(item, type) || null;
    }
  });

  return itemColor;
}

export function getItemTypeZIndex(itemType: number) {
  const itemTypeText = ItemPartType[itemType];

  switch (itemTypeText) {
    case "Tail":
      return 1;
    case "Legs":
      return 2;
    case "Body":
      return 3;
    case "Arm":
      return 4;
    case "Fist":
      return 5;
    case "Head":
      return 6;
    default:
      return 6;
  }
}

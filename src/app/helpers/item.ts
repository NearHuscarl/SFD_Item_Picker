import memoize from "lodash/memoize";
import { Item, Gender, ItemID, items, genders } from "app/data/items";
import { ColorType, ItemColor, Layer, Type } from "app/types";
import {
  COLOR_TYPES,
  ItemPartType,
  ItemPartTypeValue,
  Layers,
  LayerValue,
} from "app/constants";
import { palettes } from "app/data/palettes";
import { ColorName } from "app/data/colors";
import { getColorTypeText, getMainColor } from "app/helpers/color";

const getItemIDs = memoize(() => Object.keys(items) as ItemID[]);

function forEachItem(fn: (item: Item, index: number) => void) {
  getItemIDs().forEach((id, i) => {
    fn(items[id], i);
  });
}

export const getItems = memoize(
  (layer: Layer, gender: Gender) => {
    const result: Item[] = [];

    forEachItem((item) => {
      if (
        item.equipmentLayer === LayerValue[layer] &&
        (item.gender === gender || item.gender === genders.both)
      ) {
        result.push(item);
      }
    });

    return result;
  },
  (layer, gender) => `${layer}_${gender}`
);

export function hasColor(item: Item, colorType: ColorType) {
  return item.colorSlot[COLOR_TYPES.indexOf(colorType)];
}

export function getMainColors(item: Item, colorType: ColorType) {
  return palettes[item.colorPalette][colorType].map((name) => {
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
  return palettes[item.colorPalette][colorType][0];
}

export function getOppositeGender(item: Item): Item {
  switch (item.gender) {
    case genders.male:
      return items[item.id + "_fem"];
    case genders.female:
      return items[item.id.replace("_fem", "")];
    case genders.both:
      return item;
  }
}

export function getImages(itemID: ItemID) {
  const { fileName, data, equipmentLayer } = items[itemID];
  const layerText = Layers[equipmentLayer];
  const result: string[][] = [];

  (Object.keys(ItemPartTypeValue) as Type[]).forEach((typeStr) => {
    const type = ItemPartTypeValue[typeStr];
    const localIds = data[type];

    result[type] = [];

    localIds.forEach((localId) => {
      result[type][localId] =
        process.env.PUBLIC_URL +
        `/SFD/Items/${layerText}/${fileName}/${fileName}_${type}_${localId}.png`;
    });
  });

  return result;
}

export function globalIdToType(globalID: number) {
  return Math.floor(globalID / 50);
}

export function globalIdToLocalId(globalID: number) {
  return globalID % 50;
}

export function validateColorName(
  item: Item,
  colorType: ColorType,
  colorName: ColorName | null
) {
  if (!colorName) {
    return false;
  }

  const palette = palettes[item.colorPalette];
  return !!palette[colorType].find((c) => c === colorName);
}

export function ensureColorItemExist(id: ItemID, color: ItemColor) {
  if (id && id !== "None") {
    const item = items[id];
    return color.map((name, i) => {
      const type = getColorTypeText(i);
      if (!color[i] && hasColor(item, type)) {
        return getDefaultColorName(item, type);
      }
      return color[i];
    }) as ItemColor;
  }
  return color;
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

import { Item } from "app/data/items";
import { getMainColors, hasColor } from "app/helpers/item";
import { COLOR_TYPES } from "app/constants";
import { ItemColor } from "app/types";

export function randomArrItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomItemColors(item: Item) {
  const colors = COLOR_TYPES.map((type) => {
    if (!hasColor(item, type)) {
      return undefined;
    }
    return randomArrItem(getMainColors(item, type));
  });
  return colors.map((c) => (c ? c.name : null)) as ItemColor;
}

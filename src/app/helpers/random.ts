import { Item } from "app/data/items";
import { getMainColors, hasColor } from "app/helpers/item";
import { ItemColor } from "app/types";
import { forEachColorType } from "app/helpers/index";

export function randomArrItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomItemColors(item: Item) {
  const itemColor: ItemColor = [null, null, null];

  forEachColorType((type, i) => {
    if (hasColor(item, type)) {
      itemColor[i] = randomArrItem(getMainColors(item, type)).name;
    }
  });

  return itemColor;
}

import memoize from "lodash/memoize";
import { getGender } from "app/helpers/item";
import { Item, ItemID, items } from "app/data/items.db";

export type { ItemID, Item, Gender } from "app/data/items.db";
export { NULL_ITEM } from "app/data/items.db";

export function getItem(id?: ItemID) {
  return items[id || "None"];
}

export const getItemIDs = memoize(() => Object.keys(items).sort() as ItemID[]);

export function getOppositeGender(item: Item): Item {
  switch (getGender(item)) {
    case "male":
      return items[item.id + "_fem"];
    case "female":
      return items[item.id.replace("_fem", "")];
    case "both":
      return item;
  }
}

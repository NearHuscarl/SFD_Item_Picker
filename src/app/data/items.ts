import { genders, Item, ItemID, items } from "app/data/items.db";
import memoize from "lodash/memoize";

export type { ItemID, Item, Gender } from "app/data/items.db";
export { NULL_ITEM, genders } from "app/data/items.db";

export function getItem(id?: ItemID) {
  return items[id || "None"];
}

export const getItemIDs = memoize(() => Object.keys(items) as ItemID[]);

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

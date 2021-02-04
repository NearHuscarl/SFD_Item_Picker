import memoize from "lodash/memoize";
import { Item, ItemID, items } from "app/data/items";
import { Layer, Type } from "app/types";
import { ItemPartTypeValue, Layers, LayerValue } from "app/constants";

const getItemIDs = memoize(() => Object.keys(items) as ItemID[]);

function forEachItem(fn: (item: Item, id: ItemID) => void) {
  getItemIDs().forEach((id) => {
    fn(items[id], id);
  });
}

export const getItems = memoize((layer: Layer) => {
  const items: Item[] = [];
  forEachItem((item) => {
    if (item.equipmentLayer === LayerValue[layer]) {
      items.push(item);
    }
  });
  return items;
});

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

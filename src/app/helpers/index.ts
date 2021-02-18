// uncategorized helper methods

import { Layer } from "app/types";
import { Layers } from "app/constants";

export function forEachLayer(cb: (layer: Layer) => void) {
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((layerIndex) => {
    const layer = Layers[layerIndex];
    cb(layer);
  });
}

// https://stackoverflow.com/a/54931396/9449426
export function stringifyOneLineArray(obj: object) {
  return JSON.stringify(
    obj,
    (k, v) => {
      if (v instanceof Array) return JSON.stringify(v);
      return v;
    },
    2
  )
    .replace(/\\/g, "")
    .replace(/\"\[/g, "[")
    .replace(/\]\"/g, "]")
    .replace(/\"\{/g, "{")
    .replace(/\}\"/g, "}");
}

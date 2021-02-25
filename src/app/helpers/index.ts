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

// Array.filter(Boolean) still return (any | undefined)[] in typescript
// https://stackoverflow.com/a/58110124/9449426
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isArrayEqual<T>(arr1: T[], arr2: T[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

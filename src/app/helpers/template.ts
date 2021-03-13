import { ProfileSettings } from "app/types";
import { Genders } from "app/constants";
import { forEachLayer } from "app/helpers/index";
import { encodeProfile } from "app/helpers/profile.coder";

function quote(str = "") {
  return `"${str}"`;
}

const EMPTY_CLOTHING_ITEM_REGEX = /\s*(Skin|ChestUnder|Legs|Waist|Feet|ChestOver|Accesory|Hands|Head)\s*=\s*new IProfileClothingItem\s*\(\s*""\s*,\s*""\s*,\s*""\s*,\s*""\s*\)\s*,/g;

export function fillTemplate(template: string, settings: ProfileSettings) {
  const isMale = settings.gender === Genders.male;
  const map = {
    __NAME__: quote(settings.name),
    __GENDER__: isMale ? "Gender.Male" : "Gender.Female",
    __LINK__: window.location.origin + "?p=" + encodeProfile(settings),
  };

  forEachLayer((layer) => {
    const LAYER = layer.toUpperCase();
    const itemId = settings[layer].id;
    const itemColors = settings[layer].colors;

    if (itemId !== "None") {
      map[`__${LAYER}__`] = quote(itemId);
      map[`__${LAYER}_PRIMARY__`] = quote(itemColors[0] || "");
      map[`__${LAYER}_SECONDARY__`] = quote(itemColors[1] || "");
      map[`__${LAYER}_TERTIARY__`] = quote(itemColors[2] || "");
    } else {
      map[`__${LAYER}__`] = quote();
      map[`__${LAYER}_PRIMARY__`] = quote();
      map[`__${LAYER}_SECONDARY__`] = quote();
      map[`__${LAYER}_TERTIARY__`] = quote();
    }
  });

  template = replaceAll(template, map);

  return template
    .replace(EMPTY_CLOTHING_ITEM_REGEX, "")
    .replace(/("\w+"\s*,\s*"\w+")\s*,\s*""\s*\)/g, "$1)") // 1 empty color, remove the last param
    .replace(/("\w+")\s*,\s*""\s*,\s*""\s*\)/g, "$1)") // 2 empty colors, remove 2 last params
    .replace(/\s*,\s*""\s*,\s*""\s*,\s*""\s*\)/g, ', "")'); // 3 empty colors, remove 2 last params and add one empty string color to prevent ambiguous method call
}

function replaceAll(str: string, map: object) {
  const re = new RegExp(Object.keys(map).join("|"), "gi");

  return str.replace(re, (matched) => map[matched]);
}

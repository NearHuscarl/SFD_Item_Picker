import { ProfileSettings } from "app/types";
import { Genders } from "app/constants";
import { forEachLayer } from "app/helpers/index";

function quote(str = "") {
  return `"${str}"`;
}

export function fillTemplate(template: string, settings: ProfileSettings) {
  const isMale = settings.gender === Genders.male;
  const map = {
    __NAME__: quote(settings.name),
    __GENDER__: isMale ? "Gender.Male" : "Gender.Female",
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

  // TODO: only default template
  if (true) {
    template = template.replace(
      new RegExp('.*IProfileClothingItem\\("", "", "", ""\\).*\r?\n?', "mg"),
      ""
    );
  }

  return template;
}

function replaceAll(str: string, map: object) {
  const re = new RegExp(Object.keys(map).join("|"), "gi");

  return str.replace(re, (matched) => map[matched]);
}

import camelCase from "lodash/camelCase";
import { Layer, ProfileSettings } from "app/types";
import { genders } from "app/data/items";

export type TemplateName = "IProfile" | "Script";
export function getTemplate(name: TemplateName) {
  return fetch(`/templates/${name}.cs`).then((r) => r.text());
}

function quote(str: string) {
  return `"${str}"`;
}

function fillName(template: string, settings: ProfileSettings) {
  return template.replace(`__NAME__`, quote(settings.name));
}

function fillGender(template: string, settings: ProfileSettings) {
  if (settings.gender === genders.male) {
    template = template.replace(`__GENDER__`, "Gender.Male");
  } else {
    template = template.replace(`__GENDER__`, "Gender.Female");
  }

  return template;
}

// TODO: move to action layer
function fillEquipment(
  template: string,
  settings: ProfileSettings,
  layer: Layer
) {
  const LAYER = layer.toUpperCase();
  const getter = camelCase(layer);

  if (settings[getter] !== "None") {
    const colorGetter = `${getter}Colors`;

    template = template
      .replace(`__${LAYER}__`, quote(settings[getter]))
      .replace(`__${LAYER}_PRIMARY__`, quote(settings[colorGetter][0] || ""))
      .replace(`__${LAYER}_SECONDARY__`, quote(settings[colorGetter][1] || ""))
      .replace(`__${LAYER}_TERTIARY__`, quote(settings[colorGetter][2] || ""));
  } else {
    const strToSetToNull = `__${LAYER}__`;

    if (template.indexOf(strToSetToNull) > -1)
      template = template.replace(
        new RegExp(`.*__${LAYER}__.*\r?\n?`, "m"),
        ""
      );
  }

  return template;
}

export function fillTemplate(template: string, settings: ProfileSettings) {
  template = fillName(template, settings);
  template = fillGender(template, settings);
  template = fillEquipment(template, settings, "Accessory");
  template = fillEquipment(template, settings, "ChestOver");
  template = fillEquipment(template, settings, "ChestUnder");
  template = fillEquipment(template, settings, "Feet");
  template = fillEquipment(template, settings, "Hands");
  template = fillEquipment(template, settings, "Head");
  template = fillEquipment(template, settings, "Legs");
  template = fillEquipment(template, settings, "Skin");
  template = fillEquipment(template, settings, "Waist");

  return template;
}

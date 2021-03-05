import { DefaultGroup } from "app/constants";
import { ProfileGroup } from "app/types";

export function groupNameComparer(a: ProfileGroup, b: ProfileGroup) {
  if (a.name === DefaultGroup.name) {
    return -1;
  }
  if (b.name === DefaultGroup.name) {
    return 1;
  }
  return a.name.localeCompare(b.name);
}

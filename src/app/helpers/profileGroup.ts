import { DefaultGroup } from "app/constants";
import { ProfileGroup } from "app/types";

export function groupNameComparer(a: ProfileGroup, b: ProfileGroup) {
  if (a.ID === DefaultGroup.ID) {
    return -1;
  }
  if (b.ID === DefaultGroup.ID) {
    return 1;
  }
  return a.name.localeCompare(b.name);
}

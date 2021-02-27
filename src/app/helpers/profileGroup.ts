import { DEFAULT_GROUP_NAME } from "app/constants";

function groupNameComparer(a: string, b: string) {
  if (a === DEFAULT_GROUP_NAME) {
    return -1;
  }
  if (b === DEFAULT_GROUP_NAME) {
    return 1;
  }
  return a.localeCompare(b);
}
export function sortGroupName(groupNames: string[]) {
  return groupNames.sort(groupNameComparer);
}

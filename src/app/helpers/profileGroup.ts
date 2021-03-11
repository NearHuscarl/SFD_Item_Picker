import { DefaultGroup } from "app/constants";
import { GroupID, ProfileGroup } from "app/types";

type ProfileGroupLike = {
  ID: GroupID;
  name: string;
};

export function groupNameComparer(a: ProfileGroupLike, b: ProfileGroupLike) {
  if (a.ID === DefaultGroup.ID) {
    return -1;
  }
  if (b.ID === DefaultGroup.ID) {
    return 1;
  }
  return a.name.localeCompare(b.name);
}

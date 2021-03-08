import { PropsWithChildren } from "react";
import {
  ProfileGroupRenameProvider,
  useProfileGroupRename,
} from "app/pages/home/profileGroup/ProfileGroupRenameProvider";
import {
  ProfileGroupDeleteProvider,
  useProfileGroupDelete,
} from "app/pages/home/profileGroup/ProfileGroupDeleteProvider";

export function ProfileGroupActionProvider({
  children,
}: PropsWithChildren<{}>) {
  return (
    <ProfileGroupRenameProvider>
      <ProfileGroupDeleteProvider>{children}</ProfileGroupDeleteProvider>
    </ProfileGroupRenameProvider>
  );
}

export function useProfileGroupAction() {
  const one = useProfileGroupRename();
  const two = useProfileGroupDelete();

  return { ...one, ...two };
}

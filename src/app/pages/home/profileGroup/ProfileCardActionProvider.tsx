import { PropsWithChildren } from "react";
import {
  ProfileCardContextMenuProvider,
  useProfileCardContextMenu,
} from "app/pages/home/profileGroup/ProfileCardContextMenuProvider";
import {
  ProfileCardMoveMenuProvider,
  useProfileCardMoveMenu,
} from "app/pages/home/profileGroup/ProfileCardMoveMenuProvider";

export function ProfileCardActionProvider({ children }: PropsWithChildren<{}>) {
  return (
    <ProfileCardContextMenuProvider>
      <ProfileCardMoveMenuProvider>{children}</ProfileCardMoveMenuProvider>
    </ProfileCardContextMenuProvider>
  );
}

export function useProfileCardAction() {
  const one = useProfileCardContextMenu();
  const two = useProfileCardMoveMenu();

  return { ...one, ...two };
}

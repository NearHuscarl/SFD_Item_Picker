import { PropsWithChildren } from "react";
import { ProfileCardContextMenuProvider } from "app/pages/home/profileGroup/ProfileCardContextMenuProvider";
import { ProfileCardMoveMenuProvider } from "app/pages/home/profileGroup/ProfileCardMoveMenuProvider";

export function ProfileCardActionProvider({ children }: PropsWithChildren<{}>) {
  return (
    <ProfileCardContextMenuProvider>
      <ProfileCardMoveMenuProvider>{children}</ProfileCardMoveMenuProvider>
    </ProfileCardContextMenuProvider>
  );
}

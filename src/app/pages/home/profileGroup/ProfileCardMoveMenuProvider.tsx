import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  MouseEvent,
} from "react";
import { __PRODUCTION__ } from "app/constants";
import { Popover } from "@material-ui/core";
import {
  useGroupSummariesGetter,
  useMoveProfileToGroupDispatcher,
} from "app/actions/profile";
import { MenuData, GroupID, ProfileID } from "app/types";
import { GroupMenu } from "app/widgets/GroupMenu";

type ProfileCardMoveMenuContextValues = {
  openMoveMenu: (params: {
    event: MouseEvent;
    profileID: ProfileID;
    groupID: GroupID;
  }) => void;
};

const EMPTY_PROFILE_CARD_MOVE_MENU_CONTEXT = Object.freeze({} as any);
export const ProfileCardMoveMenuContext = createContext<ProfileCardMoveMenuContextValues>(
  EMPTY_PROFILE_CARD_MOVE_MENU_CONTEXT
);

function useMoveMenu() {
  const getGroupSummary = useGroupSummariesGetter();
  const moveProfileToGroup = useMoveProfileToGroupDispatcher();
  const [moveMenuAnchorEl, setMoveMenuAnchorEl] = useState(null);
  const [moveMenu, setMoveMenu] = useState<MenuData[]>([]);
  const onOpenMoveMenu = (e) => {
    e.stopPropagation();
    setMoveMenuAnchorEl(e.currentTarget);
  };
  const onCloseMoveMenu = () => {
    setMoveMenuAnchorEl(null);
  };
  const isOpenMoveMenu = Boolean(moveMenuAnchorEl);

  return {
    moveMenuAnchorEl,
    moveMenu,
    onCloseMoveMenu,
    isOpenMoveMenu,
    openMoveMenu: ({ event, profileID, groupID }) => {
      const groups = getGroupSummary();
      setMoveMenu(
        groups
          .filter((g) => g.ID !== groupID)
          .map((g) => ({
            name: g.name,
            onClick: () => {
              onCloseMoveMenu();
              moveProfileToGroup(profileID, g.ID);
            },
          }))
      );
      onOpenMoveMenu(event);
    },
  };
}

export function ProfileCardMoveMenuProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    openMoveMenu,
    moveMenu,
    moveMenuAnchorEl,
    onCloseMoveMenu,
    isOpenMoveMenu,
  } = useMoveMenu();
  const [value] = useState(() => ({ openMoveMenu }));

  return (
    <ProfileCardMoveMenuContext.Provider value={value}>
      {children}
      <Popover
        open={isOpenMoveMenu}
        anchorEl={moveMenuAnchorEl}
        onClose={onCloseMoveMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: -8,
          horizontal: "left",
        }}
      >
        <GroupMenu options={moveMenu} placeholder="Select a group to move to" />
      </Popover>
    </ProfileCardMoveMenuContext.Provider>
  );
}

export function useProfileCardMoveMenu() {
  const contextValue = useContext(ProfileCardMoveMenuContext);

  if (!__PRODUCTION__) {
    if (contextValue === EMPTY_PROFILE_CARD_MOVE_MENU_CONTEXT) {
      throw new Error(
        "could not find ProfileCardMoveMenu context value; please ensure the component is wrapped in a <ProfileCardMoveMenuProvider>"
      );
    }
  }

  return contextValue;
}

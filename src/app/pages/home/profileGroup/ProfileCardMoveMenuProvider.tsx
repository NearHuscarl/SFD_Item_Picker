import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  MouseEvent,
} from "react";
import { __PRODUCTION__ } from "app/constants";
import {
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  useGroupSummariesGetter,
  useMoveProfileToGroupDispatcher,
} from "app/actions/profile";
import { MenuData, GroupID, ProfileID } from "app/types";

const useStyles = makeStyles((theme) => ({
  popoverText: {
    padding: `10px ${theme.spacing(2)}px`,
    color: theme.palette.grey[500],
  },
}));

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
  const classes = useStyles();
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
        <Typography variant="body1" className={classes.popoverText}>
          Select a group to move to
        </Typography>
        <Divider light />
        <MenuList>
          {moveMenu.map(({ name, onClick }) => (
            <MenuItem key={name} onClick={onClick}>
              {name}
            </MenuItem>
          ))}
        </MenuList>
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

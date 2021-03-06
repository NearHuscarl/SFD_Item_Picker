import { createContext, PropsWithChildren, useContext, useState } from "react";
import { __PRODUCTION__, DefaultGroup } from "app/constants";
import {
  useDeleteProfileDispatcher,
  useGroupSummariesGetter,
  useMoveProfileToGroupDispatcher,
  useRemoveProfileFromGroupDispatcher,
} from "app/actions/profile";
import {
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { MenuData, GroupID, ProfileID } from "app/types";

const useStyles = makeStyles((theme) => ({
  popoverText: {
    padding: `10px ${theme.spacing(2)}px`,
    color: theme.palette.grey[500],
  },
}));

type ProfileCardActionContextValues = {
  openContextMenu: ({
    event: MouseEvent,
    profileID: ProfileID,
    groupID: GroupID,
  }) => void;
  openMoveMenu: ({
    event: MouseEvent,
    profileID: ProfileID,
    groupID: GroupID,
  }) => void;
};

const EMPTY_PROFILE_CARD_ACTION_CONTEXT = Object.freeze({} as any);
export const ProfileCardActionContext = createContext<ProfileCardActionContextValues>(
  EMPTY_PROFILE_CARD_ACTION_CONTEXT
);

type MousePosition = {
  x: number | null;
  y: number | null;
};
const initialState: MousePosition = {
  x: null,
  y: null,
};

function useContextMenu() {
  const deleteProfile = useDeleteProfileDispatcher();
  const removeProfileFromGroup = useRemoveProfileFromGroupDispatcher();
  const [contextMenu, setContextMenu] = useState<MenuData[]>([]);
  const [mousePosition, setMousePosition] = useState<MousePosition>(
    initialState
  );
  const isOpenContextMenu = mousePosition.y !== null;
  const openContextMenu = (e) => {
    e.preventDefault();
    if (isOpenContextMenu) {
      onCloseContextMenu();
    } else {
      setMousePosition({
        x: e.clientX - 2,
        y: e.clientY - 4,
      });
    }
  };
  const onCloseContextMenu = () => {
    setMousePosition(initialState);
  };

  return {
    isOpenContextMenu,
    contextMenu,
    onCloseContextMenu,
    mousePosition,
    openContextMenu: ({ event, profileID, groupID }) => {
      const contextMenu: MenuData[] = [
        {
          name: "Delete",
          onClick: () => {
            onCloseContextMenu();
            deleteProfile(profileID);
          },
        },
      ];

      if (groupID !== DefaultGroup.ID) {
        contextMenu.unshift({
          name: "Remove from group",
          onClick: () => {
            onCloseContextMenu();
            removeProfileFromGroup(profileID);
          },
        });
      }

      setContextMenu(contextMenu);
      openContextMenu(event);
    },
  };
}

function useMoveMenu() {
  const classes = useStyles();
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
    classes,
    moveMenuAnchorEl,
    moveMenu,
    onCloseMoveMenu,
    isOpenMoveMenu,
    openMoveMenu: ({ event, profileID, groupID }) => {
      const groups = getGroupSummary();
      setMoveMenu(
        groups
          .filter((g) => g.id !== groupID)
          .map((g) => ({
            name: g.name,
            onClick: () => {
              onCloseMoveMenu();
              moveProfileToGroup(profileID, g.id);
            },
          }))
      );
      onOpenMoveMenu(event);
    },
  };
}

export function ProfileCardActionProvider({ children }: PropsWithChildren<{}>) {
  const {
    contextMenu,
    openContextMenu,
    isOpenContextMenu,
    onCloseContextMenu,
    mousePosition,
  } = useContextMenu();
  const {
    classes,
    openMoveMenu,
    moveMenu,
    moveMenuAnchorEl,
    onCloseMoveMenu,
    isOpenMoveMenu,
  } = useMoveMenu();

  const [value] = useState(() => ({ openContextMenu, openMoveMenu }));

  return (
    <ProfileCardActionContext.Provider value={value}>
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
      <Menu
        open={isOpenContextMenu}
        onClose={onCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          mousePosition.y !== null && mousePosition.x !== null
            ? { top: mousePosition.y, left: mousePosition.x }
            : undefined
        }
      >
        {contextMenu.map(({ name, onClick }) => (
          <MenuItem key={name} button onClick={onClick}>
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Menu>
    </ProfileCardActionContext.Provider>
  );
}

export function useProfileCardAction() {
  const contextValue = useContext(ProfileCardActionContext);

  if (!__PRODUCTION__) {
    if (contextValue === EMPTY_PROFILE_CARD_ACTION_CONTEXT) {
      throw new Error(
        "could not find ProfileCardAction context value; please ensure the component is wrapped in a <ProfileCardActionProvider>"
      );
    }
  }

  return contextValue;
}

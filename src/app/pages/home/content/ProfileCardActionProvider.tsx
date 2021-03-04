import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { __PRODUCTION__, DEFAULT_GROUP_NAME } from "app/constants";
import {
  useDeleteProfileDispatcher,
  useGroupNamesSelector,
  useMoveProfileToGroupDispatcher,
  useRemoveProfileFromGroupDispatcher,
} from "app/actions/profileGroup";
import {
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Popover,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { MenuData } from "app/types";

const useStyles = makeStyles((theme) => ({
  popoverText: {
    padding: theme.spacing(2),
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.palette.grey[500],
  },
}));

type ProfileCardActionContextValues = {
  openContextMenu: ({
    event: MouseEvent,
    profileID: number,
    groupID: string,
  }) => void;
  openMoveMenu: ({
    event: MouseEvent,
    profileID: number,
    groupID: string,
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
    openContextMenu: useMemo(
      () => ({ event, profileID, groupID }) => {
        const contextMenu: MenuData[] = [
          {
            name: "Delete",
            onClick: () => deleteProfile(profileID),
          },
        ];

        if (groupID !== DEFAULT_GROUP_NAME) {
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
      []
    ),
  };
}

function useMoveMenu() {
  const classes = useStyles();
  const moveProfileToGroup = useMoveProfileToGroupDispatcher();
  const [moveMenuAnchorEl, setMoveMenuAnchorEl] = useState(null);
  const groupNames = useGroupNamesSelector();
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
    openMoveMenu: useMemo(
      () => ({ event, profileID, groupID }) => {
        setMoveMenu(
          groupNames
            .filter((g) => g !== groupID)
            .map((groupName) => ({
              name: groupName,
              onClick: () => {
                onCloseMoveMenu();
                moveProfileToGroup(profileID, groupName);
              },
            }))
        );
        onOpenMoveMenu(event);
      },
      [groupNames]
    ),
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

  const value = useMemo(
    () => ({
      openContextMenu,
      openMoveMenu,
    }),
    [openContextMenu, openMoveMenu]
  );

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
        <div className={classes.popoverText}>Select a group to move to</div>
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

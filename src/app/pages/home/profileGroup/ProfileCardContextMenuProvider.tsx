import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  MouseEvent,
  useCallback,
} from "react";
import { __PRODUCTION__, DefaultGroup } from "app/constants";
import { ListItemText, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import {
  useDeleteProfileDispatcher,
  useSelectedProfileDownloader,
  useRemoveProfileFromGroupDispatcher,
  useShareSelectedProfile,
} from "app/actions/profile";
import { MenuData, GroupID, ProfileID } from "app/types";
import { useCopyCodeGen, useCopySelectedCodeGen } from "app/actions/template";
import { useEventListener } from "app/helpers/hooks";
import { useGetCurrentTab } from "app/actions/global";

const useStyles = makeStyles((theme) => ({
  contextMenu: {
    width: 250,
  },
  shortcut: {
    color: theme.palette.grey[500],
  },
}));

type ProfileCardContextMenuContextValues = {
  openContextMenu: (params: {
    event: MouseEvent;
    profileID: ProfileID;
    groupID: GroupID;
  }) => void;
};

const EMPTY_PROFILE_CARD_CONTEXT_MENU_CONTEXT = Object.freeze({} as any);
export const ProfileCardContextMenuContext = createContext<ProfileCardContextMenuContextValues>(
  EMPTY_PROFILE_CARD_CONTEXT_MENU_CONTEXT
);

type MousePosition = {
  x: number | null;
  y: number | null;
};
const initialState: MousePosition = {
  x: null,
  y: null,
};

type ContextMenuData = MenuData & {
  shortcut?: string;
};

function useContextMenu() {
  const { enqueueSnackbar } = useSnackbar();
  const getCurrentTab = useGetCurrentTab();
  const copyCodeGen = useCopyCodeGen();
  const copySelectedCodeGen = useCopySelectedCodeGen();
  const shareSelectedProfile = useShareSelectedProfile();
  const downloadSelectedProfile = useSelectedProfileDownloader();
  const deleteProfile = useDeleteProfileDispatcher();
  const removeProfileFromGroup = useRemoveProfileFromGroupDispatcher();
  const [contextMenu, setContextMenu] = useState<ContextMenuData[]>([]);
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

  const onGlobalKeyPress = useCallback((e) => {
    if (getCurrentTab() !== "profileGroup") {
      return;
    }

    if (e.ctrlKey) {
      switch (e.key) {
        case "z": {
          downloadSelectedProfile();
          break;
        }
        case "x": {
          const profile = copySelectedCodeGen();
          const message = `Copy code from profile '${profile.name}' to clipboard`;
          enqueueSnackbar(message, {
            key: message,
            autoHideDuration: 2000,
          });
          break;
        }
        case "s": {
          e.preventDefault(); // prevent default browser behavior (open save html file dialog or sth)
          const profile = shareSelectedProfile();
          const message = `Profile "${profile.name}"'s link has been copied to clipboard`;
          enqueueSnackbar(message, {
            key: message,
            autoHideDuration: 2000,
          });
          break;
        }
      }
    }
  }, []);

  useEventListener("keydown", onGlobalKeyPress);

  return {
    isOpenContextMenu,
    contextMenu,
    onCloseContextMenu,
    mousePosition,
    openContextMenu: ({ event, profileID, groupID }) => {
      const contextMenu: ContextMenuData[] = [
        {
          name: "Copy code",
          shortcut: "Ctrl+X",
          onClick: () => {
            copyCodeGen(profileID);
            onCloseContextMenu();
          },
        },
        {
          name: "Copy profile URL",
          shortcut: "Ctrl+S",
          onClick: () => {
            shareSelectedProfile(profileID);
            onCloseContextMenu();
          },
        },
        {
          name: "Download profile image",
          shortcut: "Ctrl+Z",
          onClick: () => {
            downloadSelectedProfile(profileID);
            onCloseContextMenu();
          },
        },
        {
          name: "Remove from group",
          disabled: groupID === DefaultGroup.ID,
          onClick: () => {
            onCloseContextMenu();
            removeProfileFromGroup(profileID);
          },
        },
        {
          name: "Delete",
          onClick: () => {
            onCloseContextMenu();
            deleteProfile(profileID);
          },
        },
      ];

      setContextMenu(contextMenu);
      openContextMenu(event);
    },
  };
}

export function ProfileCardContextMenuProvider({
  children,
}: PropsWithChildren<{}>) {
  const classes = useStyles();
  const {
    contextMenu,
    openContextMenu,
    isOpenContextMenu,
    onCloseContextMenu,
    mousePosition,
  } = useContextMenu();

  const [value] = useState(() => ({ openContextMenu }));

  return (
    <ProfileCardContextMenuContext.Provider value={value}>
      {children}
      <Menu
        classes={{
          paper: classes.contextMenu,
        }}
        open={isOpenContextMenu}
        onClose={onCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          mousePosition.y !== null && mousePosition.x !== null
            ? { top: mousePosition.y, left: mousePosition.x }
            : undefined
        }
      >
        {contextMenu.map(({ name, onClick, disabled, shortcut }) => (
          <MenuItem key={name} button onClick={onClick} disabled={disabled}>
            <ListItemText primary={name} />
            {shortcut && <div className={classes.shortcut}>{shortcut}</div>}
          </MenuItem>
        ))}
      </Menu>
    </ProfileCardContextMenuContext.Provider>
  );
}

export function useProfileCardContextMenu() {
  const contextValue = useContext(ProfileCardContextMenuContext);

  if (!__PRODUCTION__) {
    if (contextValue === EMPTY_PROFILE_CARD_CONTEXT_MENU_CONTEXT) {
      throw new Error(
        "could not find ProfileCardContextMenu context value; please ensure the component is wrapped in a <ProfileCardContextMenuProvider>"
      );
    }
  }

  return contextValue;
}

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { __PRODUCTION__, DefaultGroup } from "app/constants";
import { useRenameGroupDispatcher } from "app/actions/profile";
import { Popover, TextField } from "@material-ui/core";
import { ProfileGroup } from "app/types";
import { useStore } from "react-redux";

type ProfileGroupRenameContextValues = {
  requestRenameGroup: ({ event, id: GroupID }) => void;
};

const EMPTY_PROFILE_GROUP_RENAME_CONTEXT = Object.freeze({} as any);
export const ProfileGroupRenameContext = createContext<ProfileGroupRenameContextValues>(
  EMPTY_PROFILE_GROUP_RENAME_CONTEXT
);

function useRenameGroup() {
  const renameGroup = useRenameGroupDispatcher();
  const groupToRenameRef = useRef<ProfileGroup>(DefaultGroup);
  const store = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openRenameTextField = Boolean(anchorEl);
  const onCloseRenameTextField = () => {
    setAnchorEl(null);
  };
  const onOpenRenameTextField = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const onNameChange = (e) => {
    if (e.key === "Enter" && e.target.value) {
      confirmRenameGroup(e.target.value);
    }
  };
  const confirmRenameGroup = (newName: string) => {
    if (groupToRenameRef.current.ID === DefaultGroup.ID) {
      throw new Error(`Default group cannot be renamed`);
    }
    renameGroup({
      id: groupToRenameRef.current.ID,
      newName,
    });
    groupToRenameRef.current = DefaultGroup;
    onCloseRenameTextField();
  };

  useEffect(() => {
    if (openRenameTextField) {
      // just open the popover. The TextField inside it does not exist yet
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = groupToRenameRef.current.name;
          inputRef.current.select();
        }
      });
    }
  }, [openRenameTextField]);

  return {
    anchorEl,
    inputRef,
    openRenameTextField,
    onNameChange,
    onCloseRenameTextField,
    requestRenameGroup: ({ event, id }) => {
      onOpenRenameTextField(event);
      groupToRenameRef.current = store.getState().profiles.group[id];
    },
  };
}

export function ProfileGroupRenameProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    anchorEl,
    inputRef,
    openRenameTextField,
    onNameChange,
    requestRenameGroup,
    onCloseRenameTextField,
  } = useRenameGroup();
  const [value] = useState(() => ({ requestRenameGroup }));

  return (
    <ProfileGroupRenameContext.Provider value={value}>
      {children}
      <Popover
        elevation={0}
        transitionDuration={0}
        open={openRenameTextField}
        anchorEl={anchorEl}
        onClose={onCloseRenameTextField}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <TextField inputRef={inputRef} onKeyPress={onNameChange} />
      </Popover>
    </ProfileGroupRenameContext.Provider>
  );
}

export function useProfileGroupRename() {
  const contextValue = useContext(ProfileGroupRenameContext);

  if (!__PRODUCTION__) {
    if (contextValue === EMPTY_PROFILE_GROUP_RENAME_CONTEXT) {
      throw new Error(
        "could not find ProfileGroupRename context value; please ensure the component is wrapped in a <ProfileGroupRenameProvider>"
      );
    }
  }

  return contextValue;
}

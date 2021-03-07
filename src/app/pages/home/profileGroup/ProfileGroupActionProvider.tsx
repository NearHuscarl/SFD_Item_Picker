import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { __PRODUCTION__, DefaultGroup } from "app/constants";
import {
  useDeleteGroupDispatcher,
  useRenameGroupDispatcher,
} from "app/actions/profile";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popover,
  TextField,
} from "@material-ui/core";
import { GroupID, ProfileGroup } from "app/types";
import { useStore } from "react-redux";

type ProfileGroupActionContextValues = {
  requestRenameGroup: ({ event, id: GroupID }) => void;
  requestDeleteGroup: (id: GroupID) => void;
};

const EMPTY_PROFILE_GROUP_ACTION_CONTEXT = Object.freeze({} as any);
export const ProfileGroupActionContext = createContext<ProfileGroupActionContextValues>(
  EMPTY_PROFILE_GROUP_ACTION_CONTEXT
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

function useDeleteGroup() {
  const deleteGroup = useDeleteGroupDispatcher();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const store = useStore();
  const onOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
  const onCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const groupToDeleteRef = useRef<ProfileGroup>(DefaultGroup);

  return {
    openDeleteDialog,
    groupToDeleteRef,
    onCloseDeleteDialog,
    requestDeleteGroup: (id: GroupID) => {
      onOpenDeleteDialog();
      groupToDeleteRef.current = store.getState().profiles.group[id];
    },
    confirmDeleteGroup: () => {
      if (groupToDeleteRef.current.ID === DefaultGroup.ID) {
        throw new Error(`Default group cannot be deleted`);
      }
      deleteGroup(groupToDeleteRef.current.ID);
      groupToDeleteRef.current = DefaultGroup;
      onCloseDeleteDialog();
    },
  };
}

export function ProfileGroupActionProvider({
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
  const {
    openDeleteDialog,
    groupToDeleteRef,
    onCloseDeleteDialog,
    requestDeleteGroup,
    confirmDeleteGroup,
  } = useDeleteGroup();
  const [value] = useState(() => ({ requestRenameGroup, requestDeleteGroup }));

  return (
    <ProfileGroupActionContext.Provider value={value}>
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
      <Dialog open={openDeleteDialog} onClose={onCloseDeleteDialog}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Profile group <strong>"{groupToDeleteRef.current.name}"</strong>{" "}
            will be deleted. All profiles in that group will be transferred to{" "}
            <strong>"{DefaultGroup.name}"</strong> group.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDeleteDialog} color="primary">
            Close
          </Button>
          <Button onClick={confirmDeleteGroup} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ProfileGroupActionContext.Provider>
  );
}

export function useProfileGroupAction() {
  const contextValue = useContext(ProfileGroupActionContext);

  if (!__PRODUCTION__) {
    if (contextValue === EMPTY_PROFILE_GROUP_ACTION_CONTEXT) {
      throw new Error(
        "could not find ProfileGroupAction context value; please ensure the component is wrapped in a <ProfileGroupActionProvider>"
      );
    }
  }

  return contextValue;
}

import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import { __PRODUCTION__, DefaultGroup } from "app/constants";
import { useDeleteGroupDispatcher } from "app/actions/profile";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { GroupID, ProfileGroup } from "app/types";
import { useStore } from "react-redux";

type ProfileGroupActionContextValues = {
  requestDeleteGroup: (id: GroupID) => void;
};

const EMPTY_PROFILE_GROUP_ACTION_CONTEXT = Object.freeze({} as any);
export const ProfileGroupActionContext = createContext<ProfileGroupActionContextValues>(
  EMPTY_PROFILE_GROUP_ACTION_CONTEXT
);

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
    openDeleteDialog,
    groupToDeleteRef,
    onCloseDeleteDialog,
    requestDeleteGroup,
    confirmDeleteGroup,
  } = useDeleteGroup();
  const [value] = useState(() => ({ requestDeleteGroup }));

  return (
    <ProfileGroupActionContext.Provider value={value}>
      {children}
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

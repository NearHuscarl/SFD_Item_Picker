import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import AddBox from "@material-ui/icons/AddBox";
import {
  useCanSaveGetter,
  useClearProfileDispatcher,
} from "app/actions/editor";

export function CreateNewProfileButton() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const canSave = useCanSaveGetter();
  const clearProfile = useClearProfileDispatcher();
  const onClose = () => setOpenConfirm(false);
  const onCreateNewProfile = () => {
    clearProfile();
    onClose();
  };
  const onRequestCreate = () => {
    if (canSave()) {
      setOpenConfirm(true);
    } else {
      clearProfile();
    }
  };

  return (
    <>
      <IconButton
        onClick={onRequestCreate}
        title="new profile"
        aria-label="new profile"
      >
        <AddBox />
      </IconButton>
      <Dialog open={openConfirm} onClose={onClose}>
        <DialogTitle>Create new profile?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Changes you made to the current draft will not be saved. Proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            No
          </Button>
          <Button onClick={onCreateNewProfile} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

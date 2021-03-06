import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import {
  useAddGroupDispatcher,
  useGroupSummariesGetter,
} from "app/actions/profile";

export function AddNewGroupButton() {
  const [open, setOpen] = useState(false);
  const addGroup = useAddGroupDispatcher();
  const getGroupSummaries = useGroupSummariesGetter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const isError = Boolean(error);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setName("");
  };
  const onCreate = () => {
    addGroup(name);
    onClose();
  };
  const onNameChange = (e) => {
    const groups = getGroupSummaries();
    const newName = e.target.value;
    let error = "";

    for (let g of groups) {
      if (newName === g.name) {
        error = `"${newName}" has already been defined`;
        break;
      }
    }

    if (!newName) {
      error = "Group name cannot be empty";
    }

    setError(error);
    setName(newName);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={onOpen}
      >
        New Group
      </Button>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>New Profile Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Profile group name must be unique.
          </DialogContentText>
          <TextField
            autoFocus
            autoComplete="off"
            error={isError}
            helperText={error}
            margin="dense"
            label="Group Name"
            id="groupName"
            value={name}
            onChange={onNameChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onCreate} color="primary" disabled={isError}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

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
import { useForm } from "react-hook-form";
import {
  useAddGroupDispatcher,
  useGroupSummariesGetter,
} from "app/actions/profile";

export function NewGroupButton() {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: { name: "" },
  });
  const [open, setOpen] = useState(false);
  const addGroup = useAddGroupDispatcher();
  const getGroupSummaries = useGroupSummariesGetter();
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onSubmit = ({ name }) => {
    addGroup(name);
    onClose();
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
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogTitle>New Profile Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Profile group name must be unique.
            </DialogContentText>
            <TextField
              name="name"
              inputRef={register({
                required: "Name is a required field",
                validate: async (value) =>
                  getGroupSummaries().findIndex((t) => t.name === value) ===
                    -1 || `"${value}" has already been defined`,
              })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              autoFocus
              margin="dense"
              label="Group Name"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

import { useState } from "react";
import {
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import { makeStyles } from "@material-ui/styles";
import { useCanAddGroupSelector } from "app/actions/profile";
import {
  useAddProfileDispatcher,
  useGroupNamesSelector,
} from "app/actions/profileGroup";

const useStyles = makeStyles((theme) => ({
  popoverText: {
    padding: theme.spacing(2),
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.palette.grey[500],
  },
}));

export function AddToGroupButton() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const onClose = () => {
    setAnchorEl(null);
  };
  const onAddToGroup = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const canAddGroup = useCanAddGroupSelector();
  const groupNames = useGroupNamesSelector();
  const addProfile = useAddProfileDispatcher();

  if (!canAddGroup) {
    return null;
  }

  const onSelectGroup = (groupID: string) => () => {
    onClose();
    addProfile(groupID);
  };

  return (
    <>
      <IconButton
        title="add to group"
        aria-label="add to group"
        onClick={onAddToGroup}
      >
        <AddCircle />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: -8,
          horizontal: "left",
        }}
      >
        <div className={classes.popoverText}>Select a group to add to</div>
        <Divider light />
        <MenuList>
          {groupNames.map((name) => (
            <MenuItem key={name} onClick={onSelectGroup(name)}>
              {name}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}

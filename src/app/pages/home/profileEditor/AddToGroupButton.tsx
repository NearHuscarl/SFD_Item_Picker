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
  useGroupSummariesGetter,
} from "app/actions/profileGroup";
import { MenuData } from "app/types";

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
  const canAddGroup = useCanAddGroupSelector();
  const addProfile = useAddProfileDispatcher();
  const getGroupSummaries = useGroupSummariesGetter();
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [anchorEl, setAnchorEl] = useState(null);

  if (!canAddGroup) {
    return null;
  }

  const open = Boolean(anchorEl);
  const onClose = () => setAnchorEl(null);
  const onAddToGroup = (e) => {
    const groups = getGroupSummaries();

    setMenuData(
      groups.map(({ id, name }) => ({
        name,
        onClick: () => {
          onClose();
          addProfile(id);
        },
      }))
    );
    setAnchorEl(e.currentTarget);
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
          {menuData.map(({ name, onClick }) => (
            <MenuItem key={name} onClick={onClick}>
              {name}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}

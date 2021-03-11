import { useState } from "react";
import {
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from "@material-ui/core";
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import { makeStyles } from "@material-ui/styles";
import { useGroupSummariesGetter } from "app/actions/profile";
import {
  useGroupToAddSelector,
  useSetGroupDispatcher,
} from "app/actions/editor";
import { MenuData } from "app/types";

const useStyles = makeStyles((theme) => ({
  popoverText: {
    padding: `10px ${theme.spacing(2)}px`,
    color: theme.palette.grey[500],
  },
}));

export function AddToGroupButton() {
  const classes = useStyles();
  const groupToAdd = useGroupToAddSelector();
  const setGroupToAdd = useSetGroupDispatcher();
  const getGroupSummaries = useGroupSummariesGetter();
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const onClose = () => setAnchorEl(null);
  const onAddToGroup = (e) => {
    const groups = getGroupSummaries();

    setMenuData(
      groups.map(({ ID, name }) => ({
        name,
        selected: groupToAdd === ID,
        onClick: () => {
          setGroupToAdd(ID);
          onClose();
        },
      }))
    );
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <IconButton
        title="select group to add"
        aria-label="select group to add"
        onClick={onAddToGroup}
      >
        <LibraryAdd />
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
        <Typography variant="body1" className={classes.popoverText}>
          Select a group to add to
        </Typography>
        <Divider light />
        <MenuList>
          {menuData.map(({ name, onClick, selected }) => (
            <MenuItem key={name} onClick={onClick} selected={selected}>
              {name}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}

import { useState } from "react";
import { IconButton, Popover } from "@material-ui/core";
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import { useGroupSummariesGetter } from "app/actions/profile";
import {
  useGroupToAddSelector,
  useSetGroupDispatcher,
} from "app/actions/editor";
import { MenuData } from "app/types";
import { GroupMenu } from "app/widgets/GroupMenu";

export function AddToGroupButton() {
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
        <GroupMenu options={menuData} placeholder="Select a group to add to" />
      </Popover>
    </>
  );
}

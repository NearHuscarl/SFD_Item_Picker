import { ReactNode } from "react";
import {
  Divider,
  makeStyles,
  MenuItem,
  MenuList,
  Popover,
} from "@material-ui/core";
import {
  useGroupNamesSelector,
  useMoveProfileToGroupDispatcher,
} from "app/actions/profileGroup";

const useStyles = makeStyles((theme) => ({
  popoverText: {
    padding: theme.spacing(2),
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.palette.grey[500],
  },
}));

export function ProfileCardMoveMenu(props: ProfileCardMoveMenuProps) {
  const { children, profileID, groupID, anchorEl, onClose } = props;
  const classes = useStyles();
  const groupNames = useGroupNamesSelector().filter((g) => g !== groupID);
  const moveProfileToGroup = useMoveProfileToGroupDispatcher();
  const open = Boolean(anchorEl);
  const onSelectGroup = (name: string) => () => {
    onClose?.();
    moveProfileToGroup(profileID, name);
  };

  return (
    <>
      {children}
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
        <div className={classes.popoverText}>Select a group to move to</div>
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

type ProfileCardMoveMenuProps = {
  children: ReactNode;
  profileID: number;
  groupID: string;
  anchorEl: Element | null;
  onClose?: () => void;
};

import { ReactNode, useState } from "react";
import { Menu, MenuItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { MenuData } from "app/types";

type MousePosition = {
  x: number | null;
  y: number | null;
};
const initialState: MousePosition = {
  x: null,
  y: null,
};

const useStyles = makeStyles((theme) => ({
  shortcut: {
    color: theme.palette.grey[500],
    marginLeft: theme.spacing(2),
  },
}));

export function ContextMenu(props: ContextMenuProps) {
  const { children, className, menu } = props;
  const classes = useStyles();
  const [mousePosition, setMousePosition] = useState<MousePosition>(
    initialState
  );
  const isOpen = mousePosition.y !== null;
  const handleClick = (e) => {
    e.preventDefault();
    if (isOpen) {
      handleClose();
    } else {
      setMousePosition({
        x: e.clientX - 2,
        y: e.clientY - 4,
      });
    }
  };
  const handleClose = () => {
    setMousePosition(initialState);
  };

  return (
    <div
      onContextMenu={handleClick}
      className={className}
      style={{ cursor: "context-menu" }}
    >
      {children}
      <Menu
        open={isOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          mousePosition.y !== null && mousePosition.x !== null
            ? { top: mousePosition.y, left: mousePosition.x }
            : undefined
        }
      >
        {menu.map(({ name, onClick, shortcut }) => (
          <MenuItem
            key={name}
            button
            onClick={() => {
              onClick?.();
              handleClose();
            }}
          >
            <ListItemText primary={name} />
            {shortcut && <div className={classes.shortcut}>{shortcut}</div>}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

type ContextMenuProps = {
  children: ReactNode;
  className?: string;
  menu: MenuData[];
};

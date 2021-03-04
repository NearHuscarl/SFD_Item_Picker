import { ReactNode, useState } from "react";
import { Menu, MenuItem, ListItemText } from "@material-ui/core";

type MousePosition = {
  x: number | null;
  y: number | null;
};
const initialState: MousePosition = {
  x: null,
  y: null,
};

export function ContextMenu(props: ContextMenuProps) {
  const { children, menu } = props;
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
    <div onContextMenu={handleClick} style={{ cursor: "context-menu" }}>
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
        {menu.map(({ name, onClick }) => (
          <MenuItem
            key={name}
            button
            onClick={() => {
              onClick?.();
              handleClose();
            }}
          >
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export type ContextMenuData = {
  name: string;
  onClick?: Function;
};
type ContextMenuProps = {
  children: ReactNode;
  menu: ContextMenuData[];
};

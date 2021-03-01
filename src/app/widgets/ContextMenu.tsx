import { CSSProperties, ReactNode, useState } from "react";
import {
  Menu,
  MenuItem,
  Collapse,
  ListItemText,
  List,
  useTheme,
} from "@material-ui/core";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";

type MousePosition = {
  x: number | null;
  y: number | null;
};
const initialState: MousePosition = {
  x: null,
  y: null,
};

type ContextMenuItem2 = ContextMenuItemProps & {
  children: ContextMenuData[];
};
function ContextMenuItem2(props: ContextMenuItem2) {
  const { name, onClick: onClickProps, onCloseMenu, children } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const onClick = () => {
    onClickProps?.();
    setOpen(!open);
  };

  return (
    <>
      <MenuItem key={name} button onClick={onClick}>
        <ListItemText primary={name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </MenuItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((props) => (
            <ContextMenuItem
              {...props}
              key={props.name}
              style={{
                paddingLeft: theme.spacing(3),
              }}
              onCloseMenu={onCloseMenu}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

type ContextMenuItemProps = {
  name: string;
  onClick?: Function;
  onCloseMenu: Function;
  children?: ContextMenuData[];
  style?: CSSProperties;
};
function ContextMenuItem(props: ContextMenuItemProps) {
  const { name, onClick, onCloseMenu, children, style } = props;
  if (children) {
    return (
      <ContextMenuItem2 name={name} onClick={onClick} onCloseMenu={onCloseMenu}>
        {children}
      </ContextMenuItem2>
    );
  }

  return (
    <MenuItem
      key={name}
      button
      style={style}
      onClick={() => {
        onClick?.();
        onCloseMenu();
      }}
    >
      <ListItemText primary={name} />
    </MenuItem>
  );
}

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
        {menu.map(({ name, onClick, children }) => (
          <ContextMenuItem
            key={name}
            name={name}
            onClick={onClick}
            onCloseMenu={handleClose}
          >
            {children}
          </ContextMenuItem>
        ))}
      </Menu>
    </div>
  );
}

export type ContextMenuData = {
  name: string;
  onClick?: Function;
  children?: ContextMenuData[];
};
type ContextMenuProps = {
  children: ReactNode;
  menu: ContextMenuData[];
};

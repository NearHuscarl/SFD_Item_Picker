import { useState } from "react";
import { MenuItem, MenuList, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { MenuData } from "app/types";

const useStyles = makeStyles((theme) => ({
  textField: {
    "& .MuiInputBase-root:before, & .MuiInputBase-root:after": {
      border: "none",
    },

    "& input": {
      paddingTop: 12,
      paddingBottom: 12,
    },
  },
  menuList: {
    maxHeight: 200,
    overflow: "auto",
  },
}));

const filterOption = (value: string) => (o: MenuData) => {
  value = value.toLowerCase();
  return o.name.toLowerCase().indexOf(value) > -1;
};

export function GroupMenu({ options, placeholder }: GroupMenuProps) {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const filteredOptions = options.filter(filterOption(value));

  return (
    <>
      <TextField
        className={classes.textField}
        variant="filled"
        placeholder={placeholder}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <MenuList className={classes.menuList}>
        {filteredOptions.map(({ name, onClick, selected }) => (
          <MenuItem key={name} onClick={onClick} selected={selected}>
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </>
  );
}

type GroupMenuProps = {
  options: MenuData[];
  placeholder?: string;
};

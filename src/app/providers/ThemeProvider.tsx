import { PropsWithChildren } from "react";
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

export const theme = createMuiTheme({
  palette: {
    // text: {
    //   primary: "#000000ab",
    // },
    primary: purple,
  },
  typography: {
    fontSize: 13,
  },
  props: {
    MuiTextField: {
      variant: "outlined",
      size: "small",
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
        fontSize: 13,
      },
    },
    MuiFormControlLabel: {
      root: {
        fontSize: 13,
      },
    },
    // @ts-ignore
    MuiAutocomplete: {
      root: {
        "& .MuiFormLabel-root": {
          fontSize: 13,
        },
      },
    },
  },
});

export function ThemeProvider(props: PropsWithChildren<{}>) {
  const { children } = props;
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

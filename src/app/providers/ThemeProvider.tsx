import { PropsWithChildren } from "react";
import { Theme } from "@material-ui/core";
import type {} from "@material-ui/lab/themeAugmentation";
import { createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import purple from "@material-ui/core/colors/purple";
import { fade } from "@material-ui/core/styles/colorManipulator";

declare module "@material-ui/styles" {
  interface DefaultTheme extends Theme {}
}

const primary = purple;

export const theme = createMuiTheme({
  palette: {
    // text: {
    //   primary: "#000000ab",
    // },
    primary,
  },
  typography: {
    fontSize: 13,
    body1: {
      fontSize: 13,
    },
  },
  props: {
    MuiTextField: {
      variant: "outlined",
      size: "small",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::selection": {
          color: "white",
          backgroundColor: primary[400],
        },
      },
    },
    MuiInputBase: {
      input: {
        fontSize: 13,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 12,
      },
    },
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

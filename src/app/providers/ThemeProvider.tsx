import { PropsWithChildren } from "react";
import { Theme } from "@material-ui/core";
import type {} from "@material-ui/lab/themeAugmentation";
import { createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import purple from "@material-ui/core/colors/purple";

declare module "@material-ui/styles" {
  interface DefaultTheme extends Theme {}
}

export const theme = createMuiTheme({
  palette: {
    // text: {
    //   primary: "#000000ab",
    // },
    primary: purple,
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

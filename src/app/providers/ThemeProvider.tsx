import { PropsWithChildren } from "react";
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  // palette: {
  //   text: {
  //     primary: "#000000ab",
  //   },
  // },
  typography: {
    fontSize: 13,
  },
  props: {
    MuiTextField: {
      variant: "outlined",
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
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

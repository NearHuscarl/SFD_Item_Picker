import { PropsWithChildren } from "react";
import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import { createMuiTheme, Theme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  // palette: {
  //   text: {
  //     primary: "#000000ab",
  //   },
  // },
});

export function ThemeProvider(props: PropsWithChildren<{}>) {
  const { children } = props;
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

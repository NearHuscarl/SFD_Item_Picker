import { PropsWithChildren } from "react";
import { SnackbarProvider as PrivateSnackbarProvider } from "notistack";

export function SnackbarProvider({ children }: PropsWithChildren<{}>) {
  return (
    <PrivateSnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      {children}
    </PrivateSnackbarProvider>
  );
}

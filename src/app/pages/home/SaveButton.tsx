import { Button, useTheme } from "@material-ui/core";
import { SWATCH_SIZE } from "app/widgets/Swatch";
import { useSaveProfileDispatcher } from "app/actions/profileGroup";
import { useIsDirtySelector } from "app/actions/profile";

export function SaveButton() {
  const theme = useTheme();
  const saveProfile = useSaveProfileDispatcher();
  const isDirty = useIsDirtySelector();

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!isDirty}
      onClick={() => saveProfile()}
      style={{ minWidth: SWATCH_SIZE * 2 + theme.spacing(1) }}
    >
      Save
    </Button>
  );
}

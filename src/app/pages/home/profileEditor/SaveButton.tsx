import { Button, useTheme } from "@material-ui/core";
import { SWATCH_SIZE } from "app/widgets/Swatch";
import { useSaveProfileDispatcher } from "app/actions/profile";
import {
  useCanSaveSelector,
  useIsNewProfileSelector,
} from "app/actions/editor";

export function SaveButton() {
  const theme = useTheme();
  const saveProfile = useSaveProfileDispatcher();
  const isNewProfile = useIsNewProfileSelector();
  const canSave = useCanSaveSelector();

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!canSave}
      onClick={saveProfile}
      style={{ minWidth: SWATCH_SIZE * 2 + theme.spacing(1) }}
    >
      {isNewProfile ? "Add" : "Save"}
    </Button>
  );
}

import { Box, makeStyles } from "@material-ui/core";
import { Scrollbars } from "react-custom-scrollbars";
import { ProfilePreview } from "app/pages/home/profileEditor/ProfilePreview";
import { GenderSelect } from "app/pages/home/profileEditor/GenderSelect";
import { ItemSettings } from "app/pages/home/profileEditor/ItemSettings";
import { NameTextField } from "app/pages/home/profileEditor/NameTextField";
import { ClearAllButton } from "app/pages/home/profileEditor/ClearAllButton";
import { SaveButton } from "app/pages/home/profileEditor/SaveButton";

const useStyles = makeStyles((theme) => ({
  profileEditor: {
    height: "100%",
    "& > div > :first-child": {
      // remove bottom space from react-custom-scrollbar
      marginBottom: "-19px !important",
    },
  },
  profileEditorInner: {
    overflow: "auto",
    // maxHeight: "calc(100vh - 120px)", // TODO: fix 120px magic number

    display: "flex",
    flexDirection: "column",
    paddingTop: 5,
    paddingRight: theme.spacing(2),

    "& > :not(:last-child)": {
      marginBottom: 12,
    },
    "& > :last-child": {
      marginBottom: 4,
    },
  },
  name: {
    display: "flex",
    justifyContent: "space-between",

    "& > :first-child": {
      flexGrow: 1,
    },
    "& > :not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  gender: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  resetButton: {
    marginBottom: 8,
  },
}));

function useProfileSettings() {
  const classes = useStyles();

  return { classes };
}

export function ProfileEditor() {
  const { classes } = useProfileSettings();

  return (
    <>
      <Box marginBottom={2} marginRight={2}>
        <ProfilePreview />
      </Box>
      <div className={classes.profileEditor}>
        <Scrollbars autoHide hideTracksWhenNotNeeded>
          <div className={classes.profileEditorInner}>
            <div className={classes.name}>
              <NameTextField />
              <SaveButton />
            </div>
            <div className={classes.gender}>
              <GenderSelect />
              <ClearAllButton className={classes.resetButton} />
            </div>
            <ItemSettings layer="skin" />
            <ItemSettings layer="head" />
            <ItemSettings layer="chestOver" />
            <ItemSettings layer="chestUnder" />
            <ItemSettings layer="hands" />
            <ItemSettings layer="waist" />
            <ItemSettings layer="legs" />
            <ItemSettings layer="feet" />
            <ItemSettings layer="accessory" />
          </div>
        </Scrollbars>
      </div>
    </>
  );
}

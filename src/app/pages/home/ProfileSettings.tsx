import { makeStyles } from "@material-ui/core";
import { Scrollbars } from "react-custom-scrollbars";
import { GenderSelect } from "app/pages/home/GenderSelect";
import { ItemSettings } from "app/pages/home/ItemSettings";
import { NameTextField } from "app/pages/home/NameTextField";
import { ClearAllButton } from "app/pages/home/ClearAllButton";
import { SaveButton } from "app/pages/home/SaveButton";

const useStyles = makeStyles((theme) => ({
  profileSettings: {
    height: "100%",
    "& > div > :first-child": {
      // remove bottom space from react-custom-scrollbar
      marginBottom: "-19px !important",
    },
  },
  profileSettingsInner: {
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

export function ProfileSettings(props) {
  const { classes } = useProfileSettings();

  return (
    <div className={classes.profileSettings}>
      <Scrollbars autoHide hideTracksWhenNotNeeded>
        <div className={classes.profileSettingsInner}>
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
  );
}

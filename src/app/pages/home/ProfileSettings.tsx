import { makeStyles } from "@material-ui/core";
import { GenderSelect } from "app/pages/home/GenderSelect";
import { ItemSettings } from "app/pages/home/ItemSettings";
import { NameTextField } from "app/pages/home/NameTextField";

const useStyles = makeStyles({
  profileSettings: {
    overflow: "auto",
    maxHeight: "calc(100vh - 120px)", // TODO: fix 120px magic number

    display: "flex",
    flexDirection: "column",
    paddingTop: 5,

    "& > :not(:last-child)": {
      marginBottom: 12,
    },
  },
});

export function ProfileSettings(props) {
  const classes = useStyles();

  return (
    <div className={classes.profileSettings}>
      <NameTextField />
      <GenderSelect />
      <ItemSettings layer="Skin" />
      <ItemSettings layer="Head" />
      <ItemSettings layer="ChestOver" />
      <ItemSettings layer="ChestUnder" />
      <ItemSettings layer="Hands" />
      <ItemSettings layer="Waist" />
      <ItemSettings layer="Legs" />
      <ItemSettings layer="Feet" />
      <ItemSettings layer="Accessory" />
    </div>
  );
}

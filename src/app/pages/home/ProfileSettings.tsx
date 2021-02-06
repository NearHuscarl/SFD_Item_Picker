import { makeStyles } from "@material-ui/core";
import camelCase from "lodash/camelCase";
import { GenderSelect } from "app/pages/home/GenderSelect";
import { ItemAutocomplete } from "app/pages/home/ItemAutocomplete";
import { useRedux } from "app/store/reduxHooks";
import { profileActions } from "app/store/rootDuck";
import { Layer } from "app/types";

const useStyles = makeStyles({
  profileSettings: {
    overflow: "auto",
    maxHeight: "calc(100vh - 120px)", // TODO: fix 120px magic number

    display: "flex",
    flexDirection: "column",

    "& > :not(:last-child)": {
      marginBottom: 12,
    },
  },
});

function useItemState(layer: Layer) {
  const getter = camelCase(layer);
  const setter = `set${layer}`;
  return useRedux(
    (state) => state.profile.current[getter],
    profileActions[setter]
  );
}

export function ProfileSettings(props) {
  const classes = useStyles();
  const [skin, setSkin] = useItemState("Skin");
  const [head, setHead] = useItemState("Head");
  const [chestOver, setChestOver] = useItemState("ChestOver");
  const [chestUnder, setChestUnder] = useItemState("ChestUnder");
  const [hands, setHands] = useItemState("Hands");
  const [waist, setWaist] = useItemState("Waist");
  const [legs, setLegs] = useItemState("Legs");
  const [feet, setFeet] = useItemState("Feet");
  const [accessory, setAccessory] = useItemState("Accessory");

  return (
    <div className={classes.profileSettings}>
      <GenderSelect />
      <ItemAutocomplete
        layer="Skin"
        onChangeItem={setSkin}
        defaultValue={skin}
        disableClearable
      />
      {/*<TwitterPicker />*/}
      <ItemAutocomplete
        layer="Head"
        onChangeItem={setHead}
        defaultValue={head}
      />
      <ItemAutocomplete
        layer="ChestOver"
        onChangeItem={setChestOver}
        defaultValue={chestOver}
      />
      <ItemAutocomplete
        layer="ChestUnder"
        onChangeItem={setChestUnder}
        defaultValue={chestUnder}
      />
      <ItemAutocomplete
        layer="Hands"
        onChangeItem={setHands}
        defaultValue={hands}
      />
      <ItemAutocomplete
        layer="Waist"
        onChangeItem={setWaist}
        defaultValue={waist}
      />
      <ItemAutocomplete
        layer="Legs"
        onChangeItem={setLegs}
        defaultValue={legs}
      />
      <ItemAutocomplete
        layer="Feet"
        onChangeItem={setFeet}
        defaultValue={feet}
      />
      <ItemAutocomplete
        layer="Accessory"
        onChangeItem={setAccessory}
        defaultValue={accessory}
      />
    </div>
  );
}

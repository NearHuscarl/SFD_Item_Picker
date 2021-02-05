import { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Box, Grid, TextField } from "@material-ui/core";
import startCase from "lodash/startCase";
import { Profile } from "app/widgets/Profile";
import { getItems, getOppositeGender } from "app/helpers/item";
import { Gender, Item, ItemID, items, nullItem } from "app/data/items";
import { Layer } from "app/types";
import { useSelector } from "app/store/reduxHooks";
import { GenderSelect } from "app/pages/home/GenderSelect";
import { __DEV__ } from "app/constants";

type ItemAutocompleteProps = {
  layer: Layer;
  disableClearable?: boolean;
  defaultValue?: ItemID;
  onChangeItem: (itemID: ItemID) => void;
};

function ItemAutocomplete(props: ItemAutocompleteProps) {
  const { layer, onChangeItem, defaultValue, disableClearable } = props;
  const currentGender = useSelector((state) => state.profile.current.gender);
  const options = getItems(layer, currentGender);
  const [value, setValue] = useState<Item>(items[defaultValue || "None"]);
  const onChange = (item: Item | null) => {
    if (item && item !== nullItem) {
      onChangeItem(item.id);
      setValue(item);
    }
  };

  useEffect(() => {
    if (value && value !== nullItem && value.gender !== currentGender) {
      const opposite = getOppositeGender(value);
      if (opposite.id !== value.id) {
        onChange(opposite);
      }
    }
  }, [currentGender]);

  return (
    <Autocomplete
      value={value}
      options={options}
      disableClearable={disableClearable}
      getOptionLabel={(option) =>
        option.id === "None" ? "" : __DEV__ ? option.fileName : option.gameName
      }
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={startCase(layer)} variant="outlined" />
      )}
    />
  );
}

function getDefaultItem(itemId: ItemID, currentGender: Gender) {
  const item = items[itemId];
  if (item.gender !== currentGender) {
    return getOppositeGender(item).id;
  }
  return itemId;
}

function useItemState(defaultItem?: ItemID) {
  const currentGender = useSelector((state) => state.profile.current.gender);
  return useState<ItemID>(getDefaultItem(defaultItem || "None", currentGender));
}

export function HomePage() {
  const [skin, setSkin] = useItemState("Normal");
  const [head, setHead] = useItemState();
  const [chestOver, setChestOver] = useItemState();
  const [chestUnder, setChestUnder] = useItemState();
  const [hands, setHands] = useItemState();
  const [waist, setWaist] = useItemState();
  const [legs, setLegs] = useItemState();
  const [feet, setFeet] = useItemState();
  const [accessory, setAccessory] = useItemState();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 40,
        marginLeft: 10,
        width: 400,
      }}
    >
      <Box marginBottom={3}>
        <Profile
          skin={skin}
          head={head}
          chestOver={chestOver}
          chestUnder={chestUnder}
          hands={hands}
          waist={waist}
          legs={legs}
          feet={feet}
          accessory={accessory}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <GenderSelect />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="Skin"
            onChangeItem={setSkin}
            defaultValue={skin}
            disableClearable
          />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="Head"
            onChangeItem={setHead}
            defaultValue={head}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="ChestOver"
            onChangeItem={setChestOver}
            defaultValue={chestOver}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="ChestUnder"
            onChangeItem={setChestUnder}
            defaultValue={chestUnder}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="Hands"
            onChangeItem={setHands}
            defaultValue={hands}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="Waist"
            onChangeItem={setWaist}
            defaultValue={waist}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="Legs"
            onChangeItem={setLegs}
            defaultValue={legs}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="Feet"
            onChangeItem={setFeet}
            defaultValue={feet}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemAutocomplete
            layer="Accessory"
            onChangeItem={setAccessory}
            defaultValue={accessory}
          />
        </Grid>
      </Grid>
    </div>
  );
}

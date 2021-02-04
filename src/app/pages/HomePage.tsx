import { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Grid, TextField } from "@material-ui/core";
import startCase from "lodash/startCase";
import { Profile } from "app/widgets/Profile";
import { getItems } from "app/helpers/item";
import { Item, ItemID, items } from "app/data/items";
import { Layer } from "app/types";

type ItemAutocompleteProps = {
  layer: Layer;
  disableClearable?: boolean;
  defaultValue?: Item;
  onChangeItem: (itemID?: ItemID) => void;
};

function ItemAutocomplete(props: ItemAutocompleteProps) {
  const { layer, onChangeItem, defaultValue, disableClearable } = props;
  const options = getItems(layer);

  return (
    <Autocomplete
      options={options}
      disableClearable={disableClearable}
      defaultValue={defaultValue}
      getOptionLabel={(option) => option.gameName}
      onChange={(event, newValue) => {
        onChangeItem(newValue?.id);
      }}
      renderInput={(params) => (
        <TextField {...params} label={startCase(layer)} variant="outlined" />
      )}
    />
  );
}

export function HomePage() {
  const [skin, setSkin] = useState<ItemID | undefined>("Normal");
  const [head, setHead] = useState<ItemID>();
  const [chestOver, setChestOver] = useState<ItemID>();
  const [chestUnder, setChestUnder] = useState<ItemID>();
  const [hands, setHands] = useState<ItemID>();
  const [waist, setWaist] = useState<ItemID>();
  const [legs, setLegs] = useState<ItemID>();
  const [feet, setFeet] = useState<ItemID>();
  const [accessory, setAccessory] = useState<ItemID>();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
      }}
    >
      <Grid container direction="column" alignContent="center" spacing={3}>
        <Grid item>
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
        </Grid>
        <Grid item>
          <ItemAutocomplete
            layer="Skin"
            onChangeItem={setSkin}
            defaultValue={skin && items[skin]}
            disableClearable
          />
        </Grid>
        <Grid item>
          <ItemAutocomplete layer="Head" onChangeItem={setHead} />
        </Grid>
        <Grid item>
          <ItemAutocomplete layer="ChestOver" onChangeItem={setChestOver} />
        </Grid>
        <Grid item>
          <ItemAutocomplete layer="ChestUnder" onChangeItem={setChestUnder} />
        </Grid>
        <Grid item>
          <ItemAutocomplete layer="Hands" onChangeItem={setHands} />
        </Grid>
        <Grid item>
          <ItemAutocomplete layer="Waist" onChangeItem={setWaist} />
        </Grid>
        <Grid item>
          <ItemAutocomplete layer="Legs" onChangeItem={setLegs} />
        </Grid>
        <Grid item>
          <ItemAutocomplete layer="Feet" onChangeItem={setFeet} />
        </Grid>
        <Grid item>
          <ItemAutocomplete layer="Accessory" onChangeItem={setAccessory} />
        </Grid>
      </Grid>
    </div>
  );
}

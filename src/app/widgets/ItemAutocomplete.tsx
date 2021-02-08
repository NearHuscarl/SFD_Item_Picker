import { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import startCase from "lodash/startCase";
import { __DEV__ } from "app/constants";
import { Layer } from "app/types";
import { Gender, Item, ItemID, items, nullItem } from "app/data/items";
import { getItems, getOppositeGender } from "app/helpers/item";

type ItemAutocompleteProps = {
  layer: Layer;
  disableClearable?: boolean;
  defaultValue?: ItemID;
  onChangeItem: (itemID: ItemID) => void;
  gender: Gender;
};

export function ItemAutocomplete(props: ItemAutocompleteProps) {
  const { layer, onChangeItem, defaultValue, disableClearable, gender } = props;
  const options = getItems(layer, gender);
  const [value, setValue] = useState<Item>(items[defaultValue || "None"]);
  const onChange = (item?: Item | null) => {
    if (item && item !== nullItem) {
      onChangeItem(item.id);
      setValue(item);
    } else {
      const nullItem = items["None"];
      onChangeItem(nullItem.id);
      setValue(nullItem);
    }
  };

  useEffect(() => {
    if (value) {
      if (value !== nullItem && value.gender !== gender) {
        const opposite = getOppositeGender(value);
        if (opposite.id !== value.id) {
          onChange(opposite);
        }
      }
    } else {
      onChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender]);

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
        <TextField
          {...params}
          size="small"
          label={startCase(layer)}
          variant="outlined"
        />
      )}
    />
  );
}

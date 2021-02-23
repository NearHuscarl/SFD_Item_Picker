import { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import startCase from "lodash/startCase";
import { __DEV__ } from "app/constants";
import { Layer } from "app/types";
import {
  Gender,
  Item,
  ItemID,
  getItem,
  NULL_ITEM,
  getOppositeGender,
} from "app/data/items";
import { getItems } from "app/helpers/item";

function useItemAutocomplete(props: ItemAutocompleteProps) {
  const { onChangeItem, layer, gender } = props;
  const itemValue = getItem(props.value);
  const [value, setValue] = useState<Item>(itemValue);
  const onChange = (item?: Item | null) => {
    if (item && item !== NULL_ITEM) {
      onChangeItem(item.id);
      setValue(item);
    } else {
      onChangeItem(NULL_ITEM.id);
      setValue(NULL_ITEM);
    }
  };

  useEffect(() => {
    if (value) {
      if (value !== NULL_ITEM && value.gender !== gender) {
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

  useEffect(() => {
    if (value) {
      onChange(itemValue);
    }
  }, [props.value]);

  return {
    value,
    onChange,
    options: getItems(layer, gender),
  };
}

export function ItemAutocomplete(props: ItemAutocompleteProps) {
  const { layer, disableClearable } = props;
  const { value, options, onChange } = useItemAutocomplete(props);

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
          InputLabelProps={{ shrink: true }}
          label={startCase(layer)}
          variant="outlined"
        />
      )}
    />
  );
}

type ItemAutocompleteProps = {
  layer: Layer;
  disableClearable?: boolean;
  value?: ItemID;
  onChangeItem: (itemID: ItemID) => void;
  gender: Gender;
};

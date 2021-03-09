import { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import startCase from "lodash/startCase";
import { __DEV__ } from "app/constants";
import { Layer } from "app/types";
import { Gender, Item, ItemID, getItem, NULL_ITEM } from "app/data/items";
import { getItems } from "app/helpers/item";
import { useDraftItemDispatcher } from "app/actions/editor";

function useItemAutocomplete(props: ItemAutocompleteProps) {
  const { onChangeItem, layer, gender } = props;
  const itemValue = getItem(props.value);
  const [value, setValue] = useState<Item>(itemValue);
  const onDraftChange = useDraftItemDispatcher();
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
      onChange(itemValue);
    }
  }, [props.value]);

  return {
    value,
    onChange,
    onDraftChange,
    options: getItems(layer, gender),
  };
}

export function ItemAutocomplete(props: ItemAutocompleteProps) {
  const { layer, disableClearable } = props;
  const { value, options, onChange, onDraftChange } = useItemAutocomplete(
    props
  );

  return (
    <Autocomplete
      value={value}
      // debug={__DEV__}
      options={options}
      disableClearable={disableClearable}
      getOptionLabel={(option) => (option.id === "None" ? "" : option.gameName)}
      onHighlightChange={(e, option) => {
        if (option) {
          onDraftChange({ layer, id: option.id });
        }
      }}
      onClose={() => onDraftChange({ layer, id: "None" })}
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

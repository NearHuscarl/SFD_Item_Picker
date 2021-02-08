import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ItemAutocomplete } from "app/widgets/ItemAutocomplete";
import camelCase from "lodash/camelCase";
import { ColorType, Layer } from "app/types";
import { useRedux, useSelector } from "app/store/reduxHooks";
import { profileActions } from "app/store/rootDuck";
import { ItemID, items } from "app/data/items";
import { ColorButton } from "app/widgets/ColorButton";
import { makeStyles } from "@material-ui/core";
import {
  getMainColors,
  hasColor,
  validateColor,
  getDefaultColor,
} from "app/helpers/item";
import { getMainColor } from "app/helpers/color";
import { COLOR_TYPES } from "app/constants";

function useItemState(layer: Layer) {
  const getter = camelCase(layer);
  const setter = `set${layer}`;
  return useRedux(
    (state) => state.profile.current[getter] as ItemID,
    profileActions[setter] as ActionCreatorWithPayload<ItemID>
  );
}

const useStyles = makeStyles((theme) => ({
  itemSettings: {
    display: "flex",

    "& > :first-child": {
      flexGrow: 1,
    },
    "& > :not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}));

type ItemSettingsProps = {
  layer: Layer;
};

export function ItemSettings(props: ItemSettingsProps) {
  const { layer } = props;
  const classes = useStyles();
  const [itemId, setItemId] = useItemState(layer);
  const item = items[itemId];
  const gender = useSelector((state) => state.profile.current.gender);
  const disableClearable = layer === "Skin";
  const [itemColors, setItemColors] = useRedux(
    (state) => state.profile.current[`${camelCase(layer)}Colors`],
    profileActions.setItemColors
  );
  const setColors = (type: ColorType) => (color) => {
    setItemColors({
      layer,
      type,
      name: color.name,
    });
  };
  const onChangeItem = (id: ItemID) => {
    const newItem = items[id];
    COLOR_TYPES.forEach((type, i) => {
      const validate = validateColor(newItem, type, itemColors[i]);
      if (!validate) {
        setItemColors({
          layer,
          type,
          name: getDefaultColor(newItem, type),
        });
      }
    });
    setItemId(id);
  };

  return (
    <div className={classes.itemSettings}>
      <ItemAutocomplete
        layer={layer}
        defaultValue={itemId}
        onChangeItem={onChangeItem}
        gender={gender}
        disableClearable={disableClearable}
      />
      <ColorButton
        colors={getMainColors(item, "primary")}
        color={getMainColor(itemColors[0])}
        disabled={!hasColor(item, "primary")}
        onChange={setColors("primary")}
      />
      <ColorButton
        colors={getMainColors(item, "secondary")}
        color={getMainColor(itemColors[1])}
        disabled={!hasColor(item, "secondary")}
        onChange={setColors("secondary")}
      />
    </div>
  );
}

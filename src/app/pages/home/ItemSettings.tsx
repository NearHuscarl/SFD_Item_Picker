import { ItemAutocomplete } from "app/widgets/ItemAutocomplete";
import { ColorType, Layer } from "app/types";
import { ItemID, getItem } from "app/data/items";
import { ColorButton, ColorButtonProps } from "app/widgets/ColorButton";
import { makeStyles } from "@material-ui/core";
import {
  getMainColors,
  hasColor,
  validateColorName,
  getDefaultColorName,
} from "app/helpers/item";
import { COLOR_TYPES } from "app/constants";
import {
  useItemColorsDispatcher,
  useItemColorsSelector,
  useItemDispatcher,
  useItemGenderSelector,
  useItemSelector,
} from "app/actions/profile";

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

function useItemSettings(layer: Layer) {
  const classes = useStyles();
  const itemId = useItemSelector(layer);
  const dispatchItem = useItemDispatcher();
  const item = getItem(itemId);
  const gender = useItemGenderSelector();
  const itemColors = useItemColorsSelector(layer, itemId);
  const dispatchItemColors = useItemColorsDispatcher();
  const onChangeItemColors = (type: ColorType) => (color) => {
    dispatchItemColors({
      layer,
      type,
      name: color.name,
    });
  };
  const onChangeItem = (id: ItemID) => {
    const newItem = getItem(id);
    COLOR_TYPES.forEach((type, i) => {
      const validate = validateColorName(newItem, type, itemColors[i]);
      if (!validate) {
        const defaultColor = getDefaultColorName(newItem, type);

        if (defaultColor) {
          dispatchItemColors({
            layer,
            type,
            name: defaultColor,
          });
        }
      }
    });
    dispatchItem({ id, layer });
  };

  return {
    classes,
    itemId,
    gender,
    onChangeItem,
    pickerProps: [
      {
        colors: getMainColors(item, "primary"),
        colorName: itemColors[0],
        disabled: !hasColor(item, "primary"),
        onChange: onChangeItemColors("primary"),
      },
      {
        colors: getMainColors(item, "secondary"),
        colorName: itemColors[1],
        disabled: !hasColor(item, "secondary"),
        onChange: onChangeItemColors("secondary"),
      },
    ] as ColorButtonProps[],
  };
}

export function ItemSettings(props: ItemSettingsProps) {
  const { layer } = props;
  const {
    classes,
    itemId,
    gender,
    onChangeItem,
    pickerProps,
  } = useItemSettings(layer);

  return (
    <div className={classes.itemSettings}>
      <ItemAutocomplete
        layer={layer}
        defaultValue={itemId}
        onChangeItem={onChangeItem}
        gender={gender}
        disableClearable={layer === "Skin"}
      />
      {pickerProps.map((props, i) => (
        <ColorButton
          key={i}
          colors={props.colors}
          colorName={props.colorName}
          disabled={props.disabled}
          onChange={props.onChange}
        />
      ))}
    </div>
  );
}

type ItemSettingsProps = {
  layer: Layer;
};

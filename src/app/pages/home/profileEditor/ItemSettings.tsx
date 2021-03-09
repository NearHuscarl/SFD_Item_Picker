import { makeStyles } from "@material-ui/core";
import { ItemAutocomplete } from "app/widgets/ItemAutocomplete";
import { ColorType, Layer } from "app/types";
import { ItemID, getItem } from "app/data/items";
import { ColorButton, ColorButtonProps } from "app/widgets/ColorButton";
import { getMainColors, hasColor } from "app/helpers/item";
import {
  useSingleItemColorDispatcher,
  useItemColorsSelector,
  useItemDispatcher,
  useItemGenderSelector,
  useItemSelector,
  useDraftColorDispatcher,
} from "app/actions/editor";

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
  const itemColors = useItemColorsSelector(layer);
  const setSingleItemColor = useSingleItemColorDispatcher();
  const onChangeItemColors = (type: ColorType) => (color) => {
    setSingleItemColor({ layer, type, name: color.name });
  };
  const setDraftColor = useDraftColorDispatcher();
  const onChangeItemColorDraft = (type: ColorType) => (name) => {
    setDraftColor({ layer, type, name });
  };
  const onResetItemColorDraft = (type: ColorType) => () => {
    setDraftColor({ layer, type, name: null });
  };
  const onChangeItem = (id: ItemID) => {
    if (itemId !== id) {
      dispatchItem({ id, layer });
    }
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
        onChangeDraft: onChangeItemColorDraft("primary"),
        onClose: onResetItemColorDraft("primary"),
      },
      {
        colors: getMainColors(item, "secondary"),
        colorName: itemColors[1],
        disabled: !hasColor(item, "secondary"),
        onChange: onChangeItemColors("secondary"),
        onChangeDraft: onChangeItemColorDraft("secondary"),
        onClose: onResetItemColorDraft("secondary"),
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
        value={itemId}
        onChangeItem={onChangeItem}
        gender={gender}
        disableClearable={layer === "skin"}
      />
      {pickerProps.map((props, i) => (
        <ColorButton key={i} {...props} />
      ))}
    </div>
  );
}

type ItemSettingsProps = {
  layer: Layer;
};

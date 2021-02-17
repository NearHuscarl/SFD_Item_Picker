import { Item } from "app/widgets/Item";
import { getItem } from "app/data/items";
import { Layer } from "app/types";
import { useSelector } from "app/store/reduxHooks";
import { Layers } from "app/constants";
import { useItemColorsSelector, useItemSelector } from "app/actions/profile";
import { useIndexedDB } from "app/providers/IndexedDBProvider";

type EquipmentProps = {
  layer: Layer;
};
function Equipment({ layer }: EquipmentProps) {
  const itemId = useItemSelector(layer);
  const itemColors = useItemColorsSelector(layer, itemId);

  return <Item id={itemId} color={itemColors} animation="idle" />;
}

export function Portrait() {
  const chestOverID = useSelector((state) => state.profile.current.chestOver);
  const chestOver = getItem(chestOverID);
  const { isLoadingDB } = useIndexedDB();

  if (isLoadingDB) {
    return null;
  }

  return (
    <div
      style={{
        height: 50,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((layerIndex) => {
        let layer = Layers[layerIndex];

        if (chestOver.jacketUnderBelt) {
          if (layer === "ChestOver") {
            layer = "Waist";
          } else if (layer === "Waist") {
            layer = "ChestOver";
          }
        }

        return <Equipment key={layer} layer={layer} />;
      })}
    </div>
  );
}

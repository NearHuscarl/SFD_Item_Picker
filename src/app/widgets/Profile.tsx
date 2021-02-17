import { useEffect, useReducer } from "react";
import { Item } from "app/widgets/Item";
import { getItem } from "app/data/items";
import { Layer } from "app/types";
import { useDispatch } from "react-redux";
import { globalActions } from "app/store/rootDuck";
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

function Portrait() {
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

export function Profile() {
  const dispatch = useDispatch();
  const devTool = useSelector((state) => state.global.devTool);
  const [, rerender] = useReducer((x) => ++x, 0);
  const onClick = (e) => {
    // display hidden devtool after triple-clicking profile
    if (e.detail === 3) {
      dispatch(globalActions.setDevTool(!devTool));
    }
  };

  useEffect(() => {
    const btnEl = document.getElementById(
      "render-profile-devtool-btn"
    ) as HTMLButtonElement;
    btnEl.addEventListener("click", rerender);
    return () => btnEl.removeEventListener("click", rerender);
  }, []);

  return (
    <div
      onClick={onClick}
      className="profile"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "darkorchid",
      }}
    >
      <Portrait />
    </div>
  );
}

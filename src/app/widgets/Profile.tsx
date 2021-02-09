import { useEffect, useReducer } from "react";
import { Item } from "app/widgets/Item";
import { ItemID, items } from "app/data/items";
import { ItemColor, Layer } from "app/types";
import { useDispatch } from "react-redux";
import { globalActions } from "app/store/rootDuck";
import { useSelector } from "app/store/reduxHooks";
import camelCase from "lodash/camelCase";
import { Layers } from "app/constants";

type EquipmentProps = {
  layer: Layer;
};
function Equipment({ layer }: EquipmentProps) {
  const itemGetter = camelCase(layer);
  const colorGetter = `${itemGetter}Colors`;
  const itemID = useSelector(
    (state) => state.profile.current[itemGetter]
  ) as ItemID;
  const itemColor = useSelector(
    (state) => state.profile.current[colorGetter]
  ) as ItemColor;

  return <Item id={itemID} color={itemColor} animation="idle" />;
}

function Portrait() {
  const chestOverID = useSelector((state) => state.profile.current.chestOver);
  const chestOver = items[chestOverID];

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
    // display hidden devtool after triple-click profile
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
      {/*for some reasons, the canvas needs to be rendered twice to make the image display correctly*/}
      <Portrait key={"render1"} />
      <Portrait key={"render2"} />
    </div>
  );
}

import { useEffect, useReducer, useRef } from "react";
import { Item } from "app/widgets/Item";
import { ItemID } from "app/data/items";
import { ItemColor } from "app/types";
import { useDispatch } from "react-redux";
import { globalActions } from "app/store/rootDuck";
import { useSelector } from "app/store/reduxHooks";
import { Button } from "@material-ui/core";

type ProfileSettingsProps = {
  skin?: ItemID;
  skinColors: ItemColor;
  head?: ItemID;
  headColors: ItemColor;
  chestOver?: ItemID;
  chestOverColors: ItemColor;
  chestUnder?: ItemID;
  chestUnderColors: ItemColor;
  hands?: ItemID;
  handsColors: ItemColor;
  waist?: ItemID;
  waistColors: ItemColor;
  legs?: ItemID;
  legsColors: ItemColor;
  feet?: ItemID;
  feetColors: ItemColor;
  accessory?: ItemID;
  accessoryColors: ItemColor;
};

type PortraitProps = {
  settings: ProfileSettingsProps;
};

function Portrait({ settings }: PortraitProps) {
  const {
    skin,
    head,
    chestOver,
    chestUnder,
    hands,
    waist,
    legs,
    feet,
    accessory,
    skinColors,
    headColors,
    chestOverColors,
    chestUnderColors,
    handsColors,
    waistColors,
    legsColors,
    feetColors,
    accessoryColors,
  } = settings;

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
      {<Item id={skin} animation="idle" color={skinColors} />}
      {<Item id={chestUnder} animation="idle" color={chestUnderColors} />}
      {<Item id={legs} animation="idle" color={legsColors} />}
      {<Item id={waist} animation="idle" color={waistColors} />}
      {<Item id={feet} animation="idle" color={feetColors} />}
      {<Item id={chestOver} animation="idle" color={chestOverColors} />}
      {<Item id={accessory} animation="idle" color={accessoryColors} />}
      {<Item id={hands} animation="idle" color={handsColors} />}
      {<Item id={head} animation="idle" color={headColors} />}
    </div>
  );
}

type ProfileProps = {
  settings: {
    skin?: ItemID;
    skinColors: ItemColor;
    head?: ItemID;
    headColors: ItemColor;
    chestOver?: ItemID;
    chestOverColors: ItemColor;
    chestUnder?: ItemID;
    chestUnderColors: ItemColor;
    hands?: ItemID;
    handsColors: ItemColor;
    waist?: ItemID;
    waistColors: ItemColor;
    legs?: ItemID;
    legsColors: ItemColor;
    feet?: ItemID;
    feetColors: ItemColor;
    accessory?: ItemID;
    accessoryColors: ItemColor;
  };
};

export function Profile(props: ProfileProps) {
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
      <Portrait key={"render1"} settings={props.settings} />
      <Portrait key={"render2"} settings={props.settings} />
    </div>
  );
}

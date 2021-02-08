import { Item } from "app/widgets/Item/Item";
import { ItemID } from "app/data/items";
import { ItemColor } from "app/types";

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
  } = props.settings;
  console.log("render profile");

  return (
    <div
      className="profile"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "darkorchid",
      }}
    >
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
    </div>
  );
}

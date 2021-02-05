import { Item } from "app/widgets/Item";
import { ItemID } from "app/data/items";

type ProfileProps = {
  skin?: ItemID;
  head?: ItemID;
  chestOver?: ItemID;
  chestUnder?: ItemID;
  hands?: ItemID;
  waist?: ItemID;
  legs?: ItemID;
  feet?: ItemID;
  accessory?: ItemID;
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
  } = props;
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
          height: 125,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {<Item id={skin} animation="idle" />}
        {<Item id={chestUnder} animation="idle" />}
        {<Item id={legs} animation="idle" />}
        {<Item id={waist} animation="idle" />}
        {<Item id={feet} animation="idle" />}
        {<Item id={chestOver} animation="idle" />}
        {<Item id={accessory} animation="idle" />}
        {<Item id={hands} animation="idle" />}
        {<Item id={head} animation="idle" />}
      </div>
    </div>
  );
}

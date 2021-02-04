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

  return (
    <div
      className="profile"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 200,
          height: 150,
          position: "relative",
          backgroundColor: "darkorchid",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {skin && <Item id={skin} animation="idle" />}
        {chestUnder && <Item id={chestUnder} animation="idle" />}
        {legs && <Item id={legs} animation="idle" />}
        {waist && <Item id={waist} animation="idle" />}
        {feet && <Item id={feet} animation="idle" />}
        {chestOver && <Item id={chestOver} animation="idle" />}
        {accessory && <Item id={accessory} animation="idle" />}
        {hands && <Item id={hands} animation="idle" />}
        {head && <Item id={head} animation="idle" />}
      </div>
    </div>
  );
}

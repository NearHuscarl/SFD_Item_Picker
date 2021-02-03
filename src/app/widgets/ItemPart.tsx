import { EquipmentLayer, ItemPartType } from "app/constants";
import { useEffect } from "react";

export type Type = keyof typeof ItemPartType;

type ItemPartProps = {
  item: string;
  type: Type;
  localId: number;
};

export function ItemPart(props: ItemPartProps) {
  const { item, type, localId } = props;
  const itemType = ItemPartType[type];

  return (
    <img
      alt={`${type}`}
      // src={`SFD/Items/Skin/Normal/Normal_0_0.png`}
      src={`SFD/Items/Skin/Normal/Normal_${itemType}_${localId}.png`}
      style={{ width: 100, height: 100, imageRendering: "pixelated" }}
    />
  );
}

export type Layer = keyof typeof EquipmentLayer;

type ItemProps = {
  id: string;
  layer: Layer;
};

export function Item(props: ItemProps) {
  const { id, layer } = props;

  useEffect(() => {
    fetch(`./SFD/Items/${layer}/${id}/${id}.json`)
      .then((r) => r.json())
      .then((r) => console.log(r));
  }, []);

  return <div>item</div>;
}

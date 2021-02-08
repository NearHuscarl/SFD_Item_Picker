import { makeStyles } from "@material-ui/core";
import { COLOR_TYPES, ItemPartType, Layers } from "app/constants";
import {
  getDefaultColor,
  getImages,
  globalIdToLocalId,
  globalIdToType,
  hasColor,
} from "app/helpers/item";
import { ItemID, items } from "app/data/items";
import { animations } from "app/data/animations";
import { ItemPart } from "./ItemPart";
import { ITEM_HEIGHT, ITEM_WIDTH } from "./constants";
import { ItemColor } from "app/types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { profileActions } from "app/store/rootDuck";
import { getColorTypeText } from "app/helpers/color";

const useStyles = makeStyles({
  item: {
    position: "absolute",
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
});

export type ItemProps = {
  id?: ItemID;
  animation: "idle";
  color: ItemColor;
};

export function Item(props: ItemProps) {
  const { id, animation, color } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id && id !== "None") {
      const item = items[id];
      // TODO: move to actions/ and remove useRedux
      color.forEach((name, i) => {
        const type = COLOR_TYPES[i];
        if (!color[i] && hasColor(item, type)) {
          dispatch(
            profileActions.setItemColors({
              layer: Layers[item.equipmentLayer],
              type: getColorTypeText(i),
              name: getDefaultColor(item, type),
            })
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, color);

  if (!id) return null;

  const images = getImages(id);
  const itemPartData: {
    x: number;
    y: number;
    type: number;
    localId: number;
    image: string;
  }[] = [];
  const extractAnimationData = (part, _, parts) => {
    const { x, y, id: globalID } = part;

    if (globalID < 0 && globalID !== -10) return;

    if (globalID === -10) {
      const legPart = parts.find((part) => globalIdToType(part.id) === 4);
      const legY = legPart.y - y;
      const legItemPartData = itemPartData.find((data) => data.type === 4);

      if (legItemPartData) legItemPartData.y = legY;
      return;
    }

    const localId = globalIdToLocalId(globalID);
    const type = globalIdToType(globalID);

    itemPartData.push({
      x,
      y,
      type,
      localId,
      image: images[type][localId],
    });
  };

  if (animation === "idle") {
    // TODO: animation upper body idle animation
    animations.BaseIdle[0].parts.forEach(extractAnimationData);
    animations.UpperIdle[0].parts.forEach(extractAnimationData);
  }

  return (
    <div className={classes.item}>
      {itemPartData.reverse().map(({ image, type, x, y, localId }, index) => {
        if (!image) return null;

        const itemPartId = `${id}_${ItemPartType[type]}_${localId}`;
        return (
          <ItemPart
            key={itemPartId}
            id={itemPartId}
            image={image}
            color={color}
            x={x}
            y={y}
            layer={index * type}
          />
        );
      })}
      {/*TODO: add tail ItemPart*/}
    </div>
  );
}

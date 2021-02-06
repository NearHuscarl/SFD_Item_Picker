import { memo } from "react";
import { makeStyles } from "@material-ui/core";
import { ItemPartType, TEXTURE_HEIGHT, TEXTURE_WIDTH } from "app/constants";
import { getImages, globalIdToLocalId, globalIdToType } from "app/helpers/item";
import { ItemID } from "app/data/items";
import { animations } from "app/data/animations";

const BASE_SIZE = Math.max(TEXTURE_WIDTH, TEXTURE_HEIGHT);
const RATIO = 3.5;
const ITEM_WIDTH = BASE_SIZE * RATIO;
const ITEM_HEIGHT = BASE_SIZE * RATIO;

const useStyles = makeStyles({
  item: {
    position: "absolute",
  },
  itemPart: {
    position: "absolute",
  },
});

type ItemPartProps = {
  image: string;
  type: number;
  x: number;
  y: number;
  layer: number;
};

export const ItemPart = memo((props: ItemPartProps) => {
  const { image, type, x, y, layer } = props;
  const classes = useStyles();

  return (
    <img
      className={classes.itemPart}
      alt={`${ItemPartType[type]}`}
      src={image}
      style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        imageRendering: "pixelated",
        marginTop: RATIO * y,
        marginLeft: RATIO * x,
        zIndex: layer,
      }}
    />
  );
});

export type ItemProps = {
  id?: ItemID;
  animation: "idle";
};

export function Item(props: ItemProps) {
  const { id, animation } = props;
  const classes = useStyles();

  if (!id) return null;

  const images = getImages(id);
  const itemPartData: {
    x: number;
    y: number;
    type: number;
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
      image: images[type][localId],
    });
  };

  if (animation === "idle") {
    // TODO: animation upper body idle animation
    animations.BaseIdle[0].parts.forEach(extractAnimationData);
    animations.UpperIdle[0].parts.forEach(extractAnimationData);
  }

  return (
    <div
      className={classes.item}
      style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}
    >
      {itemPartData.reverse().map(({ image, type, x, y }, index) => {
        if (!image) return null;
        return (
          <ItemPart
            key={image}
            image={image}
            type={type}
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

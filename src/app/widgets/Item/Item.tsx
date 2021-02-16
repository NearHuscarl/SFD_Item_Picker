import { makeStyles } from "@material-ui/core";
import { ItemPartType } from "app/constants";
import { getItemTypeZIndex } from "app/helpers/item";
import { ItemID } from "app/data/items";
import { ItemPart } from "./ItemPart";
import { ITEM_HEIGHT, ITEM_WIDTH } from "./constants";
import { ItemColor } from "app/types";
import {
  AnimationRenderData,
  getAnimationRenderData,
} from "app/helpers/animation";
import { getAnimation } from "app/data/animations";

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

  if (!id) return null;

  let renderData = [] as AnimationRenderData[];

  if (animation === "idle") {
    // TODO: animation upper body idle animation
    renderData = [
      ...getAnimationRenderData(id, getAnimation("BaseIdle")[0].parts),
      ...getAnimationRenderData(id, getAnimation("UpperIdle")[0].parts),
    ];
  }

  return (
    <div className={classes.item}>
      {renderData
        .reverse()
        .map(({ textureKey, type, x, y, localId }, index) => {
          if (!textureKey) return null;

          const itemPartKey = `${ItemPartType[type]}_${localId}`;
          const itemPartId = `${id}_${ItemPartType[type]}_${localId}`;
          return (
            <ItemPart
              key={itemPartKey}
              id={itemPartId}
              textureKey={textureKey}
              color={color}
              x={x}
              y={y}
              layer={(index + 1) * getItemTypeZIndex(type)}
            />
          );
        })}
    </div>
  );
}

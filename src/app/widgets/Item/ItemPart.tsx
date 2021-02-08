import { memo, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { DefaultTheme } from "@material-ui/styles";
import { ITEM_HEIGHT, ITEM_WIDTH, RATIO } from "./constants";
import { ItemColor } from "app/types";
import { applyColor } from "app/helpers/color";

const useStyles = makeStyles<DefaultTheme, ItemPartProps>({
  itemPart: {
    position: "absolute",
    marginTop: (props) => RATIO * props.y,
    marginLeft: (props) => RATIO * props.x,
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    zIndex: (props) => props.layer,
    imageRendering: "pixelated",
  },
});

type ItemPartProps = {
  id: string;
  image: string;
  x: number;
  y: number;
  layer: number;
  color: ItemColor;
};

let showMessage = false;
export const ItemPart = memo((props: ItemPartProps) => {
  const { id, image, color } = props;
  const classes = useStyles(props);

  useEffect(() => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      const img = new Image();

      img.src = image;
      img.addEventListener("load", () => {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, ITEM_WIDTH, ITEM_HEIGHT);
        const imageData = ctx.getImageData(0, 0, ITEM_WIDTH, ITEM_HEIGHT);

        applyColor(imageData.data, color);
        ctx.putImageData(imageData, 0, 0);
      });
    } else {
      if (!showMessage) {
        alert(
          "Canvas is unsupported in this crappy browser. As a consequence, you can't apply colors to your superfighter profile."
        );
        showMessage = true;
      }
    }
  }, [image, color]);

  return (
    <canvas
      id={id}
      width={ITEM_WIDTH}
      height={ITEM_HEIGHT}
      className={classes.itemPart}
    >
      <img src={image} alt={id} className={classes.itemPart} />
    </canvas>
  );
});

ItemPart.displayName = "ItemPart";

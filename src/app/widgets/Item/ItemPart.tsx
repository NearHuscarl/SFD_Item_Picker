import { memo, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { DefaultTheme } from "@material-ui/styles";
import { ITEM_HEIGHT, ITEM_WIDTH, RATIO } from "./constants";
import { ItemColor } from "app/types";
import { applyColor } from "app/helpers/color";
import { useTextureData } from "app/data/textures";

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

let showMessage = false;
function useItemPart(
  canvasId: string,
  textureKey: string,
  itemColor: ItemColor
) {
  const { getTexture } = useTextureData();

  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      getTexture(textureKey).then((result) => {
        if (result) {
          const { texture } = result;

          const smallCanvas = document.createElement("canvas");
          const smCtx = smallCanvas.getContext("2d")!;

          // cannot scale using putImageData(). Must use a temporary canvas with original texture size
          // https://stackoverflow.com/a/24468840/9449426
          smallCanvas.width = texture.width;
          smallCanvas.height = texture.height;
          applyColor(texture.data, itemColor);
          smCtx.putImageData(texture, 0, 0);

          const img = new Image();
          img.src = smallCanvas.toDataURL();
          img.addEventListener("load", () => {
            ctx.clearRect(0, 0, ITEM_WIDTH, ITEM_HEIGHT);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, ITEM_WIDTH, ITEM_HEIGHT);
          });
        }
      });
    } else {
      if (!showMessage) {
        alert(
          "Canvas is unsupported in this crappy browser. As a consequence, you can't apply colors to your superfighter profile."
        );
        showMessage = true;
      }
    }
  }, [canvasId, ...itemColor]);
}

type ItemPartProps = {
  id: string;
  textureKey: string;
  x: number;
  y: number;
  layer: number;
  color: ItemColor;
};

export const ItemPart = memo((props: ItemPartProps) => {
  const { id, textureKey, color } = props;
  const classes = useStyles(props);

  useItemPart(id, textureKey, color);

  return (
    <canvas
      id={id}
      width={ITEM_WIDTH}
      height={ITEM_HEIGHT}
      className={classes.itemPart}
    />
  );
});

ItemPart.displayName = "ItemPart";

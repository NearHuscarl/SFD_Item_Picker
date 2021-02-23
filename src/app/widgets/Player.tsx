import { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import camelCase from "lodash/camelCase";
import { getItem } from "app/data/items";
import { ProfileSettings } from "app/types";
import { ItemPartType, Layers } from "app/constants";
import { ensureColorItemExist, getItemTypeZIndex } from "app/helpers/item";
import { getAnimationRenderData } from "app/helpers/animation";
import { useAnimationFrame } from "app/helpers/hooks";
import { applyColor } from "app/helpers/color";
import { useTextureData } from "app/data/textures";

export const PLAYER_HEIGHT = 50;
export const RATIO = 3.5;

const PROFILE_WIDTH = 83;
const PROFILE_HEIGHT = 90;

const useStyles = makeStyles({
  player: {
    height: PLAYER_HEIGHT,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

type UsePlayerDrawerProps = {
  aniFrameIndex?: number;
};
type DrawPlayerParams = {
  canvas: HTMLCanvasElement;
  profile: ProfileSettings;
  ratio?: number;
};
export function usePlayerDrawer(props?: UsePlayerDrawerProps) {
  const { aniFrameIndex } = props || {};
  const baseIdleAni = useAnimationFrame("BaseIdle", aniFrameIndex);
  const upperIdleAni = useAnimationFrame("UpperIdle", aniFrameIndex);
  const { getTexture } = useTextureData();

  return async (props: DrawPlayerParams) => {
    const { canvas, profile, ratio = RATIO } = props;
    const ctx = canvas.getContext("2d")!;
    const allRenderLayers = [] as RenderLayer[];
    const chestOverID = profile.chestOver;
    const chestOver = getItem(chestOverID);

    ctx.imageSmoothingEnabled = false;

    for (let layerIndex of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
      let layer = Layers[layerIndex];

      if (chestOver.jacketUnderBelt) {
        if (layer === "ChestOver") {
          layer = "Waist";
        } else if (layer === "Waist") {
          layer = "ChestOver";
        }
      }

      // TODO: restructure ProfileSettings and remove getter/colorGetter
      // TODO: remove name from ProfileSettings to skip rendering
      const getter = camelCase(layer);
      const colorGetter = getter + "Colors";
      const itemId = profile[getter];
      const itemColors = ensureColorItemExist(itemId, profile[colorGetter]);
      const renderData = [
        ...getAnimationRenderData(itemId, baseIdleAni.parts),
        ...getAnimationRenderData(itemId, upperIdleAni.parts),
      ].reverse();

      for (let index = 0; index < renderData.length; index++) {
        const aniData = renderData[index];
        const { textureKey, type, localId, x, y } = aniData;

        if (textureKey) {
          const result = await getTexture(textureKey);

          if (result) {
            const { texture: imageData } = result;
            const layer = (index + 1) * getItemTypeZIndex(type) + layerIndex;
            const identifier = `${itemId}_${ItemPartType[type]}_${localId}`;
            applyColor(imageData.data, itemColors);

            allRenderLayers.push({
              identifier,
              imageData,
              dx: x + 2,
              dy: y + 11,
              layer,
            });
          }
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allRenderLayers
      .sort((a, b) => (a.layer > b.layer ? 1 : -1))
      .forEach((renderLayer, i) => {
        const { identifier, imageData, dx, dy } = renderLayer;

        // console.log(identifier, dx, dy);

        const smallCanvas = document.createElement("canvas");
        const smCtx = smallCanvas.getContext("2d")!;

        // cannot scale using putImageData(). Must use a temporary canvas with original texture size
        // https://stackoverflow.com/a/24468840/9449426
        smallCanvas.width = canvas.width / ratio;
        smallCanvas.height = canvas.height / ratio;
        smCtx.putImageData(imageData, dx, dy);

        ctx.drawImage(smallCanvas, 0, 0, canvas.width, canvas.height);
      });
  };
}

function usePlayer(props: PlayerProps) {
  const { profile } = props;
  const classes = useStyles();
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const onLoadCanvas = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      canvasRef.current = canvas;
      const ctx = canvas.getContext("2d") || undefined;
      if (ctx) {
        ctxRef.current = ctx;
      }
    }
  };

  const draw = usePlayerDrawer();

  useEffect(() => {
    draw({
      canvas: canvasRef.current!,
      profile,
    }).then();
  });

  return {
    classes,
    onLoadCanvas,
  };
}

export function Player(props: PlayerProps) {
  const { classes, onLoadCanvas } = usePlayer(props);

  return (
    <div className={classes.player}>
      <canvas
        ref={onLoadCanvas}
        width={PROFILE_WIDTH}
        height={PROFILE_HEIGHT}
        style={{
          imageRendering: "pixelated",
          // backgroundColor: "rgba(255,0,255,.5)",
          width: PROFILE_WIDTH,
          height: PROFILE_HEIGHT,
        }}
      />
    </div>
  );
}

type PlayerProps = {
  profile: ProfileSettings;
};

type RenderLayer = {
  identifier: string;
  imageData: ImageData;
  dx: number;
  dy: number;
  layer: number;
};

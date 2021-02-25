import { memo, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { getItem } from "app/data/items";
import { ProfileSettings } from "app/types";
import { ItemPartType, Layers } from "app/constants";
import { ensureColorItemExist, getItemTypeZIndex } from "app/helpers/item";
import { getAnimationRenderData } from "app/helpers/animation";
import { useAnimationFrame } from "app/helpers/hooks";
import { applyColor } from "app/helpers/color";
import { useTextureData } from "app/data/textures";
import { useIndexedDB } from "app/providers/IndexedDBProvider";
import { isProfileEqual } from "app/helpers/profile";

export const SCALE = 3.5;

const PROFILE_WIDTH = 83;
const PROFILE_HEIGHT = 90;

const useStyles = makeStyles({
  player: {
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
  scale?: number;
};
export function usePlayerDrawer(props?: UsePlayerDrawerProps) {
  const { aniFrameIndex } = props || {};
  const baseIdleAni = useAnimationFrame("BaseIdle", aniFrameIndex);
  const upperIdleAni = useAnimationFrame("UpperIdle", aniFrameIndex);
  const { getTexture } = useTextureData();

  return async (props: DrawPlayerParams) => {
    const { canvas, profile, scale = SCALE } = props;
    const ctx = canvas.getContext("2d")!;
    const allRenderLayers = [] as RenderLayer[];
    const chestOverID = profile.chestOver.id;
    const chestOver = getItem(chestOverID);

    ctx.imageSmoothingEnabled = false;

    for (let layerIndex of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
      let layer = Layers[layerIndex];

      if (chestOver.jacketUnderBelt) {
        if (layer === "chestOver") {
          layer = "waist";
        } else if (layer === "waist") {
          layer = "chestOver";
        }
      }

      const itemId = profile[layer].id;
      const itemColors = ensureColorItemExist(itemId, profile[layer].colors);
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
        smallCanvas.width = canvas.width / scale;
        smallCanvas.height = canvas.height / scale;
        smCtx.putImageData(imageData, dx, dy);

        ctx.drawImage(smallCanvas, 0, 0, canvas.width, canvas.height);
      });
  };
}

function usePlayer(props: PlayerProps) {
  const { profile, aniFrameIndex, scale } = props;
  const classes = useStyles();
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const { isLoadingDB } = useIndexedDB();
  const onLoadCanvas = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      canvasRef.current = canvas;
      const ctx = canvas.getContext("2d") || undefined;
      if (ctx) {
        ctxRef.current = ctx;
      }
    }
  };

  const draw = usePlayerDrawer({ aniFrameIndex });

  useEffect(() => {
    if (isLoadingDB) {
      return;
    }

    draw({
      canvas: canvasRef.current!,
      profile,
      scale,
    }).then();
  });

  return {
    classes,
    onLoadCanvas,
  };
}

export const Player = memo(
  (props: PlayerProps) => {
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
  },
  (props1, props2) =>
    isProfileEqual(props1.profile, props2.profile) &&
    props1.aniFrameIndex === props2.aniFrameIndex &&
    props1.scale === props2.scale
);
Player.displayName = "Player";

type PlayerProps = {
  profile: ProfileSettings;
  aniFrameIndex?: number;
  scale?: number;
};

type RenderLayer = {
  identifier: string;
  imageData: ImageData;
  dx: number;
  dy: number;
  layer: number;
};

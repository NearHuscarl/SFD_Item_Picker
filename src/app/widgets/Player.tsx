import { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import camelCase from "lodash/camelCase";
import { getItem } from "app/data/items";
import { ProfileSettings } from "app/types";
import { useSelector } from "app/store/reduxHooks";
import { ItemPartType, Layers } from "app/constants";
import { useIndexedDB } from "app/providers/IndexedDBProvider";
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

function usePlayer(props: PlayerProps) {
  const { profile } = props;
  const chestOverID = useSelector((state) => state.profile.current.chestOver);
  const chestOver = getItem(chestOverID);
  const classes = useStyles();
  const { isLoadingDB } = useIndexedDB();
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const onLoadCanvas = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      canvasRef.current = canvas;
      const ctx = canvas.getContext("2d") || undefined;
      if (ctx) {
        ctxRef.current = ctx;
        ctx.imageSmoothingEnabled = false;
      }
    }
  };

  const baseIdleAni = useAnimationFrame("BaseIdle");
  const upperIdleAni = useAnimationFrame("UpperIdle");
  const { getTexture } = useTextureData();

  useEffect(() => {
    if (isLoadingDB) {
      return;
    }

    (async () => {
      const ctx = ctxRef.current!;
      const canvas = canvasRef.current!;
      const allRenderLayers = [] as RenderLayer[];

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
              const identify = `${itemId}_${ItemPartType[type]}_${localId}`;
              applyColor(imageData.data, itemColors);

              allRenderLayers.push({
                identify,
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
          const { identify, imageData, dx, dy } = renderLayer;

          // console.log(identify, dx, dy);

          const smallCanvas = document.createElement("canvas");
          const smCtx = smallCanvas.getContext("2d")!;

          // cannot scale using putImageData(). Must use a temporary canvas with original texture size
          // https://stackoverflow.com/a/24468840/9449426
          smallCanvas.width = canvas.width / RATIO;
          smallCanvas.height = canvas.height / RATIO;
          smCtx.putImageData(imageData, dx, dy);

          ctx.drawImage(smallCanvas, 0, 0, canvas.width, canvas.height);
        });
    })();
  });

  return {
    classes,
    onLoadCanvas,
    isLoadingDB,
  };
}

export function Player(props: PlayerProps) {
  const { isLoadingDB, classes, onLoadCanvas } = usePlayer(props);

  if (isLoadingDB) {
    return null;
  }

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
  identify: string;
  imageData: ImageData;
  dx: number;
  dy: number;
  layer: number;
};

import { MutableRefObject, useEffect, useReducer, useRef } from "react";
import { Layer, ProfileSettings } from "app/types";
import { useTextureData } from "app/data/textures";
import { SCALE } from "app/widgets/Player";
import {
  AnimationRenderData,
  getAnimationRenderData,
} from "app/helpers/animation";
import { forEachLayer, unique } from "app/helpers";
import { getItem } from "app/data/items";
import { getItemTypeZIndex } from "app/helpers/item";
import { ItemPartType } from "app/constants";
import { applyColor } from "app/helpers/color";
import { useAnimationFrame, useAnimationLoop } from "app/helpers/hooks";
import { Frame, getAnimation } from "app/data/animations";
import { useIndexedDB } from "app/providers/IndexedDBProvider";

type DrawPlayerParams = {
  canvasRef: MutableRefObject<HTMLCanvasElement | undefined>;
  profile: ProfileSettings;
  scale?: number;
};
type RenderParams = {
  canvas: HTMLCanvasElement;
  scale?: number;
};
type RenderLayer = {
  identifier: string;
  imageData: ImageData;
  dx: number;
  dy: number;
  layer: number;
};

export function usePlayerTextures(
  props: {
    profile?: ProfileSettings;
    onTextureLoaded?: () => void;
    portrait?: boolean;
  } = {}
) {
  const { profile, onTextureLoaded, portrait = false } = props;
  const { isLoadingDB } = useIndexedDB();
  const { getTextures } = useTextureData();
  const texturesRef = useRef<Record<string, ImageData>>({});
  const profileRef = useRef(profile);
  const baseIdle = getAnimation("BaseIdle");
  const upperIdle = getAnimation("UpperIdle");
  const framesRef = useRef<[Frame, Frame]>([baseIdle[0], upperIdle[0]]);

  const loadTextures = (profile: ProfileSettings) => {
    let textureKeys = [] as string[];
    const getAllKeys = (frame: Frame) => {
      forEachLayer((layer) => {
        const itemId = profile[layer].id;
        const renderData = getAnimationRenderData(itemId, frame.parts);

        renderData.forEach((r) => {
          if (r.textureKey) {
            textureKeys.push(r.textureKey);
          }
        });
      });
    };

    if (portrait) {
      getAllKeys(baseIdle[0]);
      getAllKeys(upperIdle[0]);
    } else {
      baseIdle.forEach(getAllKeys);
      upperIdle.forEach(getAllKeys);
    }

    textureKeys = unique(textureKeys);

    return getTextures(textureKeys).then((results) => {
      texturesRef.current = {};
      results.forEach((r) => {
        if (r) {
          texturesRef.current[r.name] = r.texture;
        }
      });
      profileRef.current = profile;
      onTextureLoaded?.();
      return Promise.resolve(true);
    });
  };

  useEffect(() => {
    if (profile && !isLoadingDB) {
      loadTextures(profile).then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, isLoadingDB]);

  return {
    getFrames: () => framesRef.current,
    loadTextures,
    getRenderer() {
      return getPlayerDrawer(
        framesRef.current,
        texturesRef.current,
        profileRef.current!
      );
    },
  };
}

export function usePlayerDrawer(props: DrawPlayerParams) {
  const { canvasRef, profile, scale = SCALE } = props;
  const { getRenderer, getFrames } = usePlayerTextures({ profile });

  useAnimationFrame("BaseIdle", (frame) => (getFrames()[0] = frame));
  useAnimationFrame("UpperIdle", (frame) => (getFrames()[1] = frame));

  useAnimationLoop({
    onLoop: () => {
      const canvas = canvasRef.current;

      if (canvas) {
        const render = getRenderer();
        render({ canvas, scale });
      }
    },
  });
}

export function usePlayerPortrait(props: DrawPlayerParams) {
  const { canvasRef, profile, scale = SCALE } = props;
  const { getRenderer } = usePlayerTextures({
    profile,
    portrait: true,
    onTextureLoaded: () => {
      const render = getRenderer();
      render({
        canvas: canvasRef.current!,
        scale,
      });
    },
  });
}

function getPlayerDrawer(
  frames: [Frame, Frame],
  textures: Record<string, ImageData>,
  profile: ProfileSettings
) {
  const [baseFrame, upperFrame] = frames;

  return (props: RenderParams) => {
    const { canvas, scale = SCALE } = props;
    const ctx = canvas.getContext("2d")!;

    ctx.imageSmoothingEnabled = false;

    // @ts-ignore
    const allRenderData: Record<Layer, AnimationRenderData[]> = {};

    forEachLayer((layer) => {
      const itemId = profile[layer].id;

      allRenderData[layer] = [
        ...getAnimationRenderData(itemId, baseFrame.parts),
        ...getAnimationRenderData(itemId, upperFrame.parts),
      ].reverse();
    });

    const chestOverID = profile.chestOver.id;
    const chestOver = getItem(chestOverID);
    const allRenderLayers = [] as RenderLayer[];

    forEachLayer((layer, layerIndex) => {
      if (chestOver.jacketUnderBelt) {
        if (layer === "chestOver") {
          layer = "waist";
        } else if (layer === "waist") {
          layer = "chestOver";
        }
      }

      const itemId = profile[layer].id;
      const itemColors = profile[layer].colors;
      const renderData = allRenderData[layer];

      for (let index = 0; index < renderData.length; index++) {
        const aniData = renderData[index];
        const { textureKey, type, localId, x, y } = aniData;

        if (textureKey && textures[textureKey]) {
          const imageData = textures[textureKey];
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
    });

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

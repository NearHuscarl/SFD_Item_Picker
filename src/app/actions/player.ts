import { Layer, ProfileSettings } from "app/types";
import { useTextureData } from "app/data/textures";
import { SCALE } from "app/widgets/Player";
import {
  AnimationRenderData,
  getAnimationRenderData,
} from "app/helpers/animation";
import { forEachLayer } from "app/helpers";
import { getItem } from "app/data/items";
import { ensureColorItemExist, getItemTypeZIndex } from "app/helpers/item";
import { ItemPartType } from "app/constants";
import { applyColor } from "app/helpers/color";
import { useAnimationFrame } from "app/helpers/hooks";

type UsePlayerDrawerProps = {
  aniFrameIndex?: number;
};
type DrawPlayerParams = {
  canvas: HTMLCanvasElement;
  profile: ProfileSettings;
  scale?: number;
};
type RenderLayer = {
  identifier: string;
  imageData: ImageData;
  dx: number;
  dy: number;
  layer: number;
};

export function usePlayerDrawer(props?: UsePlayerDrawerProps) {
  const { aniFrameIndex } = props || {};
  const baseIdleAni = useAnimationFrame("BaseIdle", aniFrameIndex);
  const upperIdleAni = useAnimationFrame("UpperIdle", aniFrameIndex);
  const { getTextures } = useTextureData();

  return async (props: DrawPlayerParams) => {
    const { canvas, profile, scale = SCALE } = props;
    const ctx = canvas.getContext("2d")!;

    ctx.imageSmoothingEnabled = false;

    const textureKeys = [] as string[]; // @ts-ignore
    const allRenderData: Record<Layer, AnimationRenderData[]> = {};

    forEachLayer((layer) => {
      const itemId = profile[layer].id;
      const renderData = [
        ...getAnimationRenderData(itemId, baseIdleAni.parts),
        ...getAnimationRenderData(itemId, upperIdleAni.parts),
      ].reverse();

      allRenderData[layer] = renderData;
      renderData.forEach((r) => {
        if (r.textureKey) {
          textureKeys.push(r.textureKey);
        }
      });
    });

    const results = await getTextures(textureKeys);
    const textures: Record<string, ImageData> = {};

    results.forEach((r) => {
      if (r) {
        textures[r.name] = r.texture;
      }
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
      const itemColors = ensureColorItemExist(itemId, profile[layer].colors);
      const renderData = allRenderData[layer];

      for (let index = 0; index < renderData.length; index++) {
        const aniData = renderData[index];
        const { textureKey, type, localId, x, y } = aniData;

        if (textureKey) {
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

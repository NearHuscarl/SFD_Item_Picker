import { Part } from "app/data/animations";
import {
  getTextureKeys,
  globalIdToLocalId,
  globalIdToType,
} from "app/helpers/item";
import { ItemID } from "app/data/items";
import { ItemPartTypeValue } from "app/constants";

export type AnimationRenderData = {
  x: number;
  y: number;
  type: number;
  localId: number;
  textureKey?: string;
};

export function getAnimationRenderData(id: ItemID, parts: Part[]) {
  const textureKeys = getTextureKeys(id);
  const renderData: AnimationRenderData[] = [];

  parts.forEach((part) => {
    const { x, y, id: globalID } = part;
    let localId = -1000;
    let type = -1000;

    if (globalID >= 0) {
      type = globalIdToType(globalID);
      localId = globalIdToLocalId(globalID);
    } else {
      switch (globalID) {
        case -4: {
          // tail animation. placeholder value for frame 1, idle animation
          type = 5;
          localId = 0;
          break;
        }
        case -10: {
          const legPart = parts.find(
            (part) => globalIdToType(part.id) === ItemPartTypeValue.Legs
          )!;
          const legY = legPart.y - y;
          const legItemPartData = renderData.find(
            (data) => data.type === ItemPartTypeValue.Legs
          );

          if (legItemPartData) legItemPartData.y = legY;
          return;
        }
        default:
          return;
      }
    }

    renderData.push({
      x,
      y,
      type,
      localId,
      textureKey: textureKeys[type][localId],
    });
  });

  return renderData;
}

import { Color, ColorName, colors } from "app/data/colors";
import { ItemColor } from "app/types";
import { COLOR_TYPES } from "app/constants";

function toHexaDecimal(value: number) {
  const hex = value.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(color: Color) {
  const r = toHexaDecimal(color[0]);
  const g = toHexaDecimal(color[1]);
  const b = toHexaDecimal(color[2]);
  return `#${r}${g}${b}`;
}

export function getColorTypeText(typeIndex: number) {
  return COLOR_TYPES[typeIndex];
}

export function getMainColor(colorName: ColorName | null) {
  if (!colorName) {
    return;
  }

  const colorShades = colors[colorName];

  if (colorShades.length >= 2) {
    return colorShades[1];
  }
  return colorShades[0];
}

export function applyColor(image: Uint8ClampedArray, itemColor: ItemColor) {
  const shadeValues = [255, 192, 128] as const;
  const colorArr = [
    itemColor[0] ? colors[itemColor[0]] : [[]],
    itemColor[1] ? colors[itemColor[1]] : [[]],
    itemColor[2] ? colors[itemColor[2]] : [[]],
  ] as Color[][];

  for (let i1 = 0; i1 < colorArr.length; i1++) {
    const typeIndex = i1;
    const shades = colorArr[typeIndex];

    for (let i2 = 0; i2 < shades.length; i2++) {
      const shadeIndex = i2;
      const color = shades[shadeIndex];

      for (let i = 0; i < image.length; i += 4) {
        const r = image[i];
        const g = image[i + 1];
        const b = image[i + 2];

        // prettier-ignore
        const matchColor1 = typeIndex === 0 && shadeValues[shadeIndex] === r && g === 0 && b === 0;
        // prettier-ignore
        const matchColor2 = typeIndex === 1 && shadeValues[shadeIndex] === g && r === 0 && b === 0;
        // prettier-ignore
        const matchColor3 = typeIndex === 2 && shadeValues[shadeIndex] === b && r === 0 && g === 0;

        if (matchColor1 || matchColor2 || matchColor3) {
          image[i + 0] = color[0];
          image[i + 1] = color[1];
          image[i + 2] = color[2];
          image[i + 3] = 255;
        }
      }
    }
  }

  return image;
}

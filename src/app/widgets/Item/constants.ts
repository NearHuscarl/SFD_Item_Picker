import { TEXTURE_HEIGHT, TEXTURE_WIDTH } from "app/constants";

const BASE_SIZE = Math.max(TEXTURE_WIDTH, TEXTURE_HEIGHT);

export const RATIO = 3.5;
export const ITEM_WIDTH = BASE_SIZE * RATIO;
export const ITEM_HEIGHT = BASE_SIZE * RATIO;

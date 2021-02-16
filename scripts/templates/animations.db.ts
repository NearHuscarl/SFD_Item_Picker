// this file is auto generated. Do not touch.
export const _animations: Record<AnimationName, AnimationData> = __ANIMATIONS__;

export type AnimationData = Frame[];

type Frame = {
  parts: Part[];
  collisions: any[];
  frameEvent: string;
  time: number;
};

export type Part = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  flip: number;
  sx: number;
  sy: number;
  postFix: string;
};

export type AnimationName = __ANIMATION_NAMES__;

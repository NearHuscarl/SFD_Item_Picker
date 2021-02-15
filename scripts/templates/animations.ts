// this file is auto generated. Do not touch.
export const animations = __ANIMATIONS__;

export type AnimationData = {
  name: AnimationName;
  frames: Frame[];
};

type Frame = {
  part: Part[];
  collisions: any[];
  frameEvent: string;
  time: number;
};

type Part = {
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

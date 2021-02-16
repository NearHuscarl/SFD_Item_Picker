import { AnimationName, _animations } from "app/data/animations.db";

export type {
  Part,
  AnimationName,
  AnimationData,
} from "app/data/animations.db";

export function getAnimation(name: AnimationName) {
  return _animations[name];
}

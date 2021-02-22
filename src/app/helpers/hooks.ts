import { useCallback, useEffect, useRef, useState } from "react";
import { getAnimation, AnimationName } from "app/data/animations";

export function useOnMount(cb: Function) {
  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useInterval(callback, delay) {
  const savedCallback = useRef<Function>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const id = setInterval(() => {
      savedCallback.current?.();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function useAnimationFrame(animationName: AnimationName) {
  const aniData = getAnimation(animationName);
  const frameCount = aniData.length;
  const [frameIndex, setFrameIndex] = useState(0);
  const cb = useCallback(() => {
    if (frameCount === 1) {
      return;
    }
    setFrameIndex((f) => (f === frameCount - 1 ? 0 : ++f));
  }, []);

  useInterval(cb, [aniData[frameIndex].time]);

  return aniData[frameIndex];
}

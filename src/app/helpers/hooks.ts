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

function clampFrame(frame: number | undefined, min: number, max: number) {
  if (frame === undefined) {
    return 0;
  }
  return Math.min(Math.max(frame, min), max);
}

export function useAnimationFrame(
  animationName: AnimationName,
  aniFrameIndex?: number
) {
  const aniData = getAnimation(animationName);
  const frameCount = aniData.length;
  const [frameIndex, setFrameIndex] = useState(
    clampFrame(aniFrameIndex, 0, frameCount - 1)
  );
  const cb = useCallback(() => {
    if (frameCount === 1 || aniFrameIndex !== undefined) {
      return;
    }
    setFrameIndex((f) => (f === frameCount - 1 ? 0 : ++f));
  }, [aniFrameIndex, frameCount]);

  useInterval(cb, [aniData[frameIndex].time]);

  useEffect(() => {
    if (aniFrameIndex !== undefined) {
      setFrameIndex(clampFrame(aniFrameIndex, 0, frameCount - 1));
    }
  }, [aniFrameIndex, frameCount]);

  return aniData[frameIndex];
}

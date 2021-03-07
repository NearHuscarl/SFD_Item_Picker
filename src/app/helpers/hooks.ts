import {
  DependencyList,
  EffectCallback,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getAnimation, AnimationName } from "app/data/animations";

export function useOnMount(cb: Function) {
  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useInterval(callback, delay) {
  const savedCallback = useRef<Function>();
  const dateRef = useRef(Date.now());

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const id = setInterval(() => {
      const dateNow = Date.now();
      if (dateNow - dateRef.current <= delay * 2) {
        savedCallback.current?.();
      } else {
        // lagging behind, skip calling callback instead of calling repeatedly to 'catch up'
      }
      dateRef.current = dateNow;
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

export function useDidUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList
) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      return effect();
    }
  }, deps);
}

export function useEventListener(
  eventName: keyof HTMLElementEventMap,
  handler: Function,
  element: EventTarget = document,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef<Function>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;

    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current?.(event);

    element.addEventListener(eventName, eventListener, options);

    return () => {
      element?.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, options]);
}

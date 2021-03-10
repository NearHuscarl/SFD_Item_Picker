import { DependencyList, EffectCallback, useEffect, useRef } from "react";
import { getAnimation, AnimationName, Frame } from "app/data/animations";

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

export function useAnimationLoop(props: {
  getInterval?: () => number;
  onLoop: () => void;
}) {
  const { getInterval = () => 16.666666, onLoop } = props;

  useEffect(() => {
    let rafID = 0;
    let previousTime = 0;

    const loopAnimation = (currentTime: number) => {
      if (currentTime - previousTime >= getInterval()) {
        onLoop();
        previousTime = currentTime;
      }

      rafID = requestAnimationFrame(loopAnimation);
    };

    requestAnimationFrame(loopAnimation);

    return () => {
      cancelAnimationFrame(rafID);
    };
  }, []);
}

type RenderParams = (frame: Frame) => void;

export function useAnimationFrame(
  animationName: AnimationName,
  onChange: RenderParams
) {
  const framesRef = useRef<Frame[]>([]);
  const frameIndexRef = useRef(0);
  const getFrameCount = () => framesRef.current.length;
  const getCurrentFrame = () => {
    return framesRef.current[frameIndexRef.current];
  };

  framesRef.current = getAnimation(animationName);

  useAnimationLoop({
    getInterval: () => framesRef.current[frameIndexRef.current].time,
    onLoop: () => {
      const frameCount = getFrameCount();
      let frameIndex = frameIndexRef.current;

      frameIndexRef.current = frameIndex === frameCount - 1 ? 0 : ++frameIndex;
      onChange(getCurrentFrame());
    },
  });

  return {
    getCurrentFrame,
    getAllFrames() {
      return framesRef.current;
    },
  };
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

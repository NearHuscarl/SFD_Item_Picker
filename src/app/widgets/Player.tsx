import { memo, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { ProfileSettings } from "app/types";
import { isProfileEqual } from "app/helpers/profile";
import { usePlayerDrawer, usePlayerPortrait } from "app/actions/player";

export const SCALE = 3.5;

const PROFILE_WIDTH = 83;
const PROFILE_HEIGHT = 90;

const useStyles = makeStyles({
  player: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

function usePlayer(props: PlayerProps) {
  const { profile, scale } = props;
  const classes = useStyles();
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const onLoadCanvas = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      canvasRef.current = canvas;
      const ctx = canvas.getContext("2d") || undefined;
      if (ctx) {
        ctxRef.current = ctx;
      }
    }
  };

  usePlayerDrawer({ canvasRef, profile, scale });

  return { classes, onLoadCanvas };
}

export const Player = memo(
  (props: PlayerProps) => {
    const { classes, onLoadCanvas } = usePlayer(props);

    return (
      <div className={classes.player}>
        <canvas
          ref={onLoadCanvas}
          width={PROFILE_WIDTH}
          height={PROFILE_HEIGHT}
          style={{
            imageRendering: "pixelated",
            // backgroundColor: "rgba(255,0,255,.5)",
            width: PROFILE_WIDTH,
            height: PROFILE_HEIGHT,
          }}
        />
      </div>
    );
  },
  (props1, props2) =>
    isProfileEqual(props1.profile, props2.profile) &&
    props1.scale === props2.scale
);
Player.displayName = "Player";

type PlayerProps = {
  profile: ProfileSettings;
  scale?: number;
};

function usePortrait(props: PlayerProps) {
  const { profile, scale } = props;
  const classes = useStyles();
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const onLoadCanvas = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      canvasRef.current = canvas;
      const ctx = canvas.getContext("2d") || undefined;
      if (ctx) {
        ctxRef.current = ctx;
      }
    }
  };

  usePlayerPortrait({ scale, profile, canvasRef });

  return { classes, onLoadCanvas };
}

// duplicated of Player component except that it uses usePlayerPortrait instead of usePlayerDrawer. Needs refactor
export const Portrait = memo(
  (props: PlayerProps) => {
    const { classes, onLoadCanvas } = usePortrait(props);

    return (
      <div className={classes.player}>
        <canvas
          ref={onLoadCanvas}
          width={PROFILE_WIDTH}
          height={PROFILE_HEIGHT}
          style={{
            imageRendering: "pixelated",
            // backgroundColor: "rgba(255,0,255,.5)",
            width: PROFILE_WIDTH,
            height: PROFILE_HEIGHT,
          }}
        />
      </div>
    );
  },
  (props1, props2) =>
    isProfileEqual(props1.profile, props2.profile) &&
    props1.scale === props2.scale
);
Portrait.displayName = "Portrait";

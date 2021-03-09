import { MouseEvent } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import clsx from "clsx";

export const SWATCH_SIZE = 36;

const useStyles = makeStyles<Theme, SwatchProps>((theme) => ({
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (props) => props.color,
    cursor: "pointer",
    transition: theme.transitions.create(["box-shadow", "background-color"]),

    "&:hover": {
      boxShadow: (props) => `0px 0px 15px ${props.color}64`, // 40% alpha
    },
  },
  swatchDisabled: {
    border: "4px #e0e0e0 dashed",
    cursor: "not-allowed",
    boxShadow: "none",

    "&[aria-disabled='true']:hover": {
      boxShadow: "none",
    },
  },
}));

export type SwatchProps = {
  disabled?: boolean;
  color: string;
  name?: string;
  onClick: (color: string, e: MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: () => void;
};

export function Swatch(props: SwatchProps) {
  const { disabled, onClick, color, name, onMouseEnter } = props;
  const classes = useStyles(props);

  return (
    <div
      role="button"
      aria-label={name}
      aria-disabled={disabled}
      title={name}
      onClick={(e) => onClick(color, e)}
      className={clsx({
        [classes.swatch]: true,
        [classes.swatchDisabled]: disabled,
      })}
      onMouseEnter={onMouseEnter}
    />
  );
}

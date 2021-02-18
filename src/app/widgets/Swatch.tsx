import React from "react";
import { makeStyles, Theme } from "@material-ui/core";

export const SWATCH_SIZE = 37;

const useStyles = makeStyles<Theme, SwatchProps>((theme) => ({
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (props) => props.color,
    cursor: "pointer",
    transition: "box-shadow .25s",

    "&:hover": {
      boxShadow: (props) => `0px 0px 15px ${props.color}64`, // 40% alpha
    },
  },
  swatchDisabled: {
    width: SWATCH_SIZE - 4 * 2,
    height: SWATCH_SIZE - 4 * 2,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (props) => props.color,
    border: "4px #e0e0e0 dashed",
    cursor: "not-allowed",
  },
}));

export type SwatchProps = {
  disabled?: boolean;
  color: string;
  name?: string;
  onClick: (color: string, e: React.MouseEvent<HTMLDivElement>) => void;
};

export function Swatch(props: SwatchProps) {
  const { disabled, onClick, color, name } = props;
  const classes = useStyles(props);

  return (
    <div
      role="button"
      aria-label={name}
      title={name}
      onClick={(e) => onClick(color, e)}
      className={disabled ? classes.swatchDisabled : classes.swatch}
    />
  );
}

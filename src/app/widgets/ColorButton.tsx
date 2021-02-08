import Swatch from "react-color/lib/components/common/Swatch";
import { Color, ColorName } from "app/data/colors";
import { rgbToHex } from "app/helpers/color";
import { makeStyles, Popover } from "@material-ui/core";
import { useEffect, useState } from "react";

const SWATCH_SIZE = 37;
const button = {
  width: SWATCH_SIZE,
  height: SWATCH_SIZE,
  borderRadius: "4px",
};
const buttonDisabled = {
  width: SWATCH_SIZE - 4 * 2,
  height: SWATCH_SIZE - 4 * 2,
  border: "4px #e0e0e0 dashed",
  cursor: "not-allowed",
  borderRadius: "4px",
};

const PALETTE_GAP = 5;
const useStyles = makeStyles({
  colorPicker: {
    width: SWATCH_SIZE * 5 + PALETTE_GAP * 6,

    display: "flex",
    flexFlow: "wrap",
    justifyContent: "space-around",
    padding: 10,
    rowGap: PALETTE_GAP,
    columnGap: PALETTE_GAP,
  },
});

type ColorData = { name: ColorName; color: Color };
type ColorButtonProps = {
  color?: Color;
  colors: ColorData[];
  disabled?: boolean;
  onChange?: (color: ColorData) => void;
};
export function ColorButton(props: ColorButtonProps) {
  const { disabled = false, colors, color: colorProps, onChange } = props;
  const [color, setColor] = useState<Color>(colorProps ?? [0, 0, 0]);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const finalColor = disabled ? "#00000000" : rgbToHex(color);
  const onOpen = (_, e) => {
    if (!disabled) {
      setAnchorEl(e.currentTarget);
    }
  };
  const onClose = () => {
    setAnchorEl(null);
  };
  const onColorChange = (color: ColorData) => {
    onChange?.(color);
    setColor(color.color);
    onClose();
  };

  useEffect(() => {
    if (colorProps) {
      setColor(colorProps);
    }
  }, [colorProps]);

  return (
    <div>
      <Swatch
        role="button"
        onClick={onOpen}
        hex={finalColor}
        color={finalColor}
        style={disabled ? buttonDisabled : button}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: -8,
          horizontal: "left",
        }}
      >
        <div className={classes.colorPicker}>
          {colors.map((color) => {
            const hex = rgbToHex(color.color);
            return (
              <Swatch
                key={color.name}
                hex={hex}
                color={hex}
                style={button}
                onClick={() => onColorChange(color)}
              />
            );
          })}
        </div>
      </Popover>
    </div>
  );
}

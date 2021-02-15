import { useEffect, useState } from "react";
import { Popover } from "@material-ui/core";
import { getMainColor, rgbToHex } from "app/helpers/color";
import { Color, ColorName } from "app/data/colors";
import { Swatch, ColorPicker, SwatchData } from "app/widgets/ColorPicker";

type ColorButtonProps = {
  colorName: ColorName | null;
  colors: SwatchData[];
  disabled?: boolean;
  onChange?: (color: SwatchData) => void;
};

export function ColorButton(props: ColorButtonProps) {
  const { disabled = false, colors, colorName, onChange } = props;
  const colorValue = getMainColor(colorName);
  const [color, setColor] = useState<Color>(colorValue || [0, 0, 0]);
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
  const onColorChange = (color: SwatchData) => {
    onChange?.(color);
    setColor(color.color);
    onClose();
  };

  useEffect(() => {
    if (colorValue) {
      setColor(colorValue);
    }
  }, [colorValue]);

  return (
    <>
      <Swatch
        onClick={onOpen}
        name={colorName && !disabled ? colorName : undefined}
        color={finalColor}
        disabled={disabled}
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
        <ColorPicker colors={colors} onChange={onColorChange} />
      </Popover>
    </>
  );
}

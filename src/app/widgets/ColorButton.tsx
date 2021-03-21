import { useEffect, useState } from "react";
import { Popover } from "@material-ui/core";
import { getMainColor, rgbToHex } from "app/helpers/color";
import { Color, ColorName } from "app/data/colors";
import { Swatch, ColorPicker, SwatchData } from "app/widgets/ColorPicker";

function useColorButton(props: ColorButtonProps) {
  const {
    disabled = false,
    colorName,
    onChange,
    onClose: onCloseProps,
    onChangeDraft: onChangeDraftProps,
  } = props;
  const colorValue = getMainColor(colorName);
  const [color, setColor] = useState<Color>(colorValue || [0, 0, 0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const buttonColor = disabled ? "#00000000" : rgbToHex(color);
  const onOpen = (_, e) => {
    if (!disabled) {
      setAnchorEl(e.currentTarget);
    }
  };
  const onClose = () => {
    setAnchorEl(null);
    onCloseProps?.();
  };
  const onColorChange = (color: SwatchData) => {
    onChange?.(color);
    setColor(color.color);
    onClose();
  };
  const onChangeDraft = (colorName: ColorName) => {
    if (open) {
      onChangeDraftProps?.(colorName);
    }
  };

  useEffect(() => {
    if (colorValue) {
      setColor(colorValue);
    }
  }, [colorValue]);

  return {
    disabled,
    open,
    onOpen,
    onClose,
    buttonColor,
    anchorEl,
    onColorChange,
    onChangeDraft,
  };
}

export function ColorButton(props: ColorButtonProps) {
  const { colors, colorName } = props;
  const {
    disabled,
    open,
    onOpen,
    onClose,
    buttonColor,
    anchorEl,
    onColorChange,
    onChangeDraft,
  } = useColorButton(props);

  return (
    <>
      <Swatch
        onClick={onOpen}
        name={colorName && !disabled ? colorName : undefined}
        color={buttonColor}
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
        <ColorPicker
          colors={colors}
          onChange={onColorChange}
          onChangeDraft={onChangeDraft}
        />
      </Popover>
    </>
  );
}

export type ColorButtonProps = {
  colorName: ColorName | null;
  colors: SwatchData[];
  disabled?: boolean;
  onChange?: (color: SwatchData) => void;
  onChangeDraft?: (colorName: ColorName) => void;
  onClose?: () => void;
};

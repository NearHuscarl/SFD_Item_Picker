import { rgbToHex } from "app/helpers/color";
import { Swatch, SWATCH_SIZE } from "app/widgets/Swatch";
import { Color, ColorName } from "app/data/colors";
import { makeStyles } from "@material-ui/core";

const PALETTE_GAP = 5;
const useStyles = makeStyles({
  colorPicker: {
    width: SWATCH_SIZE * 5 + PALETTE_GAP * 4 + 10 * 2,

    display: "flex",
    flexFlow: "wrap",
    justifyContent: "space-around",
    padding: 10,
    rowGap: PALETTE_GAP,
    columnGap: PALETTE_GAP,
  },
});

export type SwatchData = { name: ColorName; color: Color };

type ColorPickerProps = {
  colors: SwatchData[];
  onChange?: (color: SwatchData) => void;
};

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
  const classes = useStyles();

  return (
    <div className={classes.colorPicker}>
      {colors.map((color) => {
        const hex = rgbToHex(color.color);

        return (
          <Swatch
            key={color.name}
            color={hex}
            name={color.name}
            onClick={() => onChange?.(color)}
          />
        );
      })}
    </div>
  );
}

export { Swatch };

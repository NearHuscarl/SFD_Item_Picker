import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { Gender } from "app/data/items";
import {
  useItemGenderDispatcher,
  useItemGenderSelector,
} from "app/actions/profile";

export function GenderSelect() {
  const gender = useItemGenderSelector();
  const dispatchGender = useItemGenderDispatcher();

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup
        row
        aria-label="gender"
        name="gender1"
        value={gender.toString()}
        onChange={(e) => dispatchGender(Number(e.target.value) as Gender)}
      >
        <FormControlLabel value="0" control={<Radio />} label="Sausage" />
        <FormControlLabel value="1" control={<Radio />} label="Taco" />
      </RadioGroup>
    </FormControl>
  );
}

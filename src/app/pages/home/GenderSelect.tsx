import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { useRedux } from "app/store/reduxHooks";
import { profileActions } from "app/store/rootDuck";
import { Gender } from "app/data/items";

export function GenderSelect() {
  const [gender, setGender] = useRedux(
    (state) => state.profile.current.gender,
    profileActions.setGender
  );

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup
        row
        aria-label="gender"
        name="gender1"
        value={gender.toString()}
        onChange={(e) => setGender(Number(e.target.value) as Gender)}
      >
        <FormControlLabel value="0" control={<Radio />} label="Sausage" />
        <FormControlLabel value="1" control={<Radio />} label="Taco" />
      </RadioGroup>
    </FormControl>
  );
}

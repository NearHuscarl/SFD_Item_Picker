import { TextField } from "@material-ui/core";
import debounce from "lodash/debounce";
import { useSelector } from "app/store/reduxHooks";
import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { profileActions } from "app/store/rootDuck";

function useNameTextField() {
  const initialValue = useSelector((state) => state.profile.current.name);
  const dispatch = useDispatch();
  const [nameValue, setNameValue] = useState(initialValue);
  const dispatchValue = useCallback(
    debounce((newValue: string) => {
      dispatch(profileActions.setName(newValue));
    }, 125),
    []
  );
  const setValue = (newValue: string) => {
    dispatchValue(newValue);
    setNameValue(newValue);
  };

  return {
    value: nameValue,
    setValue,
  };
}

export function NameTextField() {
  const { value, setValue } = useNameTextField();

  return (
    <TextField
      label="Name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

import { TextField } from "@material-ui/core";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { profileActions } from "app/store/rootDuck";

function useNameTextField() {
  const storedName = useSelector((state) => state.profile.current.name);
  const dispatch = useDispatch();
  const [name, setName] = useState(storedName);
  const dispatchValue = useCallback(
    debounce((newValue: string) => {
      dispatch(profileActions.setName(newValue));
    }, 125),
    []
  );
  const setValue = (newValue: string) => {
    dispatchValue(newValue);
    setName(newValue);
  };

  useEffect(() => {
    if (name !== storedName) {
      setName(storedName);
    }
  }, [storedName]);

  return {
    value: name,
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

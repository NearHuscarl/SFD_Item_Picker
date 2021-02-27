import { TextField } from "@material-ui/core";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { profileActions } from "app/store/rootDuck";
import { useSelectedGroupNameSelector } from "app/actions/profileGroup";

function useNameTextField() {
  const storedName = useSelector((state) => state.profile.current.name);
  const groupName = useSelectedGroupNameSelector();
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
    groupName,
  };
}

export function NameTextField() {
  const { value, setValue, groupName } = useNameTextField();
  const hintText = groupName ? `Name (${groupName})` : "Name";

  return (
    <TextField
      label={hintText}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

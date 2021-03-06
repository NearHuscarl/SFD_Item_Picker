import { settingsActions } from "app/store/rootDuck";
import { useDispatch, useSelector } from "react-redux";

export function useWrapLinesSelector() {
  return useSelector((state) => state.settings.wrapLines);
}

export function useSetWrapLines() {
  const dispatch = useDispatch();

  return (wrapLines: boolean) => {
    dispatch(settingsActions.setWrapLines(wrapLines));
  };
}

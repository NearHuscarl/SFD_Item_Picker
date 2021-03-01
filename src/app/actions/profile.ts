import { useDispatch, useSelector } from "react-redux";
import { Layer } from "app/types";
import { ensureColorItemExist } from "app/helpers/item";
import { ItemID } from "app/data/items";
import { profileActions } from "app/store/rootDuck";
import { createDispatcher } from "app/actions/createDispatcher";
import { decodeProfile } from "app/helpers/profile";
import { RootState } from "app/store/store";

export function useCanAddGroupSelector() {
  return useSelector((state) => state.profile.ID === -1);
}

export function useCanSaveSelector() {
  const a = useSelector((state: RootState) => state.profile.isDirty);
  const b = useSelector((state: RootState) => state.profile.isValid);

  return a && b;
}

export function useItemGenderSelector() {
  return useSelector((state) => state.profile.current.gender);
}

export function useItemSelector(layer: Layer) {
  return useSelector((state) => state.profile.current[layer].id);
}

export function useItemColorsSelector(layer: Layer, itemId: ItemID) {
  return useSelector((state) =>
    ensureColorItemExist(itemId, state.profile.current[layer].colors)
  );
}

export function useRandomItemDispatcher() {
  const dispatch = useDispatch();
  return () => {
    dispatch(profileActions.setRandomProfile());
  };
}

export function useSearchItemDispatcher() {
  const dispatch = useDispatch();

  return (urlParams: string) => {
    const profileParams = new URLSearchParams(urlParams).get("p");

    if (profileParams) {
      try {
        const profileSettings = decodeProfile(profileParams);
        dispatch(profileActions.setAllItems(profileSettings));
      } catch {}
    }
  };
}

export const useItemGenderDispatcher = createDispatcher(
  profileActions.setGender
);

export const useItemDispatcher = createDispatcher(profileActions.setItem);

export const useItemColorsDispatcher = createDispatcher(
  profileActions.setItemColors
);

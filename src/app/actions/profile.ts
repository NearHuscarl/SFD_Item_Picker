import { useDispatch } from "react-redux";
import { Layer, ProfileSettings } from "app/types";
import { useSelector } from "app/store/reduxHooks";
import { ensureColorItemExist, getGender, getItems } from "app/helpers/item";
import { ItemID, NULL_ITEM } from "app/data/items";
import { profileActions } from "app/store/rootDuck";
import { createDispatcher } from "app/actions/createDispatcher";
import { randomArrItem, randomItemColors } from "app/helpers/random";
import { decodeProfile } from "app/helpers/profile";
import { forEachLayer } from "app/helpers";
import { RootState } from "app/store/store";

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
  const gender = useItemGenderSelector();

  return () => {
    const result: Partial<ProfileSettings> = {};

    forEachLayer((layer) => {
      const items = getItems(layer, gender).filter((i) => {
        if (layer === "skin") {
          // filter out campaign skins (Mecha and Bear)
          return getGender(i) !== "both";
        }
        return true;
      });
      if (layer !== "skin") {
        items.push(NULL_ITEM);
      }

      const item = randomArrItem(items);
      const itemColors = randomItemColors(item);

      result[layer] = {
        id: item.id,
        colors: itemColors,
      };
    });
    dispatch(profileActions.setAllItems(result));
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

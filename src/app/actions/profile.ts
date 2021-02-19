import camelCase from "lodash/camelCase";
import { Layer, ProfileSettings } from "app/types";
import { useSelector } from "app/store/reduxHooks";
import { ensureColorItemExist, getGender, getItems } from "app/helpers/item";
import { ItemID, NULL_ITEM } from "app/data/items";
import { profileActions } from "app/store/rootDuck";
import { createDispatcher } from "app/actions/createDispatcher";
import { useDispatch } from "react-redux";
import { Layers } from "app/constants";
import { randomArrItem, randomItemColors } from "app/helpers/random";
import { decodeProfile } from "app/helpers/profile";

export function useItemGenderSelector() {
  return useSelector((state) => state.profile.current.gender);
}

export function useItemSelector(layer: Layer) {
  const getter = camelCase(layer);
  return useSelector((state) => state.profile.current[getter]);
}

export function useItemColorsSelector(layer: Layer, itemId: ItemID) {
  const getter = `${camelCase(layer)}Colors`;
  return useSelector((state) =>
    ensureColorItemExist(itemId, state.profile.current[getter])
  );
}

export function useRandomItemDispatcher() {
  const dispatch = useDispatch();
  const gender = useItemGenderSelector();

  return () => {
    const result: Partial<ProfileSettings> = {};

    Object.values(Layers).forEach((layer) => {
      const getter = camelCase(layer);
      const colorGetter = `${camelCase(layer)}Colors`;
      const items = getItems(layer, gender).filter((i) => {
        if (layer === "Skin") {
          // filter out campaign skins (Mecha and Bear)
          return getGender(i) !== "both";
        }
        return true;
      });
      if (layer !== "Skin") {
        items.push(NULL_ITEM);
      }

      const item = randomArrItem(items);
      const itemColors = randomItemColors(item);

      result[getter] = item.id;
      result[colorGetter] = itemColors;
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

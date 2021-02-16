import camelCase from "lodash/camelCase";
import { Layer } from "app/types";
import { useSelector } from "app/store/reduxHooks";
import { ensureColorItemExist } from "app/helpers/item";
import { ItemID } from "app/data/items";
import { profileActions } from "app/store/rootDuck";
import { createDispatcher } from "app/actions/createDispatcher";

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

export const useItemGenderDispatcher = createDispatcher(
  profileActions.setGender
);

export const useItemDispatcher = createDispatcher(profileActions.setItem);

export const useItemColorsDispatcher = createDispatcher(
  profileActions.setItemColors
);

import { useDispatch, useSelector } from "react-redux";
import { Layer, ProfileSettings } from "app/types";
import { ensureColorItemExist } from "app/helpers/item";
import { ItemID } from "app/data/items";
import { editorActions } from "app/store/rootDuck";
import { createDispatcher } from "app/actions/createDispatcher";
import { decodeProfile } from "app/helpers/profile";

export function useDraftSelector(settings?: keyof ProfileSettings) {
  return useSelector((state) => state.editor.draft);
}

export function useCanAddGroupSelector() {
  return useSelector((state) => state.editor.ID === -1);
}

export function useCanSaveSelector() {
  const a = useSelector((state) => state.editor.isDirty);
  const b = useSelector((state) => state.editor.isValid);

  return a && b;
}

export function useItemGenderSelector() {
  return useSelector((state) => state.editor.draft.gender);
}

export function useItemSelector(layer: Layer) {
  return useSelector((state) => state.editor.draft[layer].id);
}

export function useItemColorsSelector(layer: Layer, itemId: ItemID) {
  return useSelector((state) =>
    ensureColorItemExist(itemId, state.editor.draft[layer].colors)
  );
}

export function useRandomItemDispatcher() {
  const dispatch = useDispatch();
  return () => {
    dispatch(editorActions.setRandomProfile());
  };
}

export function useSearchItemDispatcher() {
  const dispatch = useDispatch();

  return (urlParams: string) => {
    const profileParams = new URLSearchParams(urlParams).get("p");

    if (profileParams) {
      try {
        const profileSettings = decodeProfile(profileParams);
        dispatch(editorActions.setAllItems(profileSettings));
      } catch {}
    }
  };
}

export const useItemGenderDispatcher = createDispatcher(
  editorActions.setGender
);

export const useItemDispatcher = createDispatcher(editorActions.setItem);

export const useItemColorsDispatcher = createDispatcher(
  editorActions.setItemColors
);

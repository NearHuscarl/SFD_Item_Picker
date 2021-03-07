import { useDispatch, useSelector, useStore } from "react-redux";
import { ItemColor, Layer } from "app/types";
import {
  getDefaultColorName,
  hasColor,
  validateColorName,
} from "app/helpers/item";
import { getItem, ItemID } from "app/data/items";
import { editorActions } from "app/store/rootDuck";
import { createDispatcher } from "app/actions/createDispatcher";
import { decodeProfile } from "app/helpers/profile";
import { ItemParams } from "app/store/ducks/editor.duck.util";
import { forEachColorType, isArrayEqual } from "app/helpers";

export function useDraftSelector() {
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

export function useItemColorsSelector(layer: Layer) {
  return useSelector((state) => state.editor.draft[layer].colors);
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
        dispatch(editorActions.clearProfileData());
        dispatch(editorActions.setAllItems(profileSettings));
      } catch {}
    }
  };
}

export const useItemGenderDispatcher = createDispatcher(
  editorActions.setGender
);

export function useItemDispatcher() {
  const dispatch = useDispatch();
  const store = useStore();

  return (itemParams: ItemParams) => {
    const { id, layer } = itemParams;
    const item = getItem(id);

    dispatch(editorActions.setItem(itemParams));

    const currentItemColor = store.getState().editor.draft[layer].colors;
    const itemColor = [...currentItemColor] as ItemColor;

    forEachColorType((type, i) => {
      if (itemColor[i] && !hasColor(item, type)) {
        itemColor[i] = null;
      }
      if (!validateColorName(item, type, itemColor[i])) {
        itemColor[i] = getDefaultColorName(item, type) || null;
      }
      if (!itemColor[i] && hasColor(item, type)) {
        itemColor[i] = getDefaultColorName(item, type) || null;
      }
    });

    if (!isArrayEqual(currentItemColor, itemColor)) {
      dispatch(editorActions.setItemColor({ itemColor, layer }));
    }
  };
}

export const useSingleItemColorDispatcher = createDispatcher(
  editorActions.setSingleItemColor
);

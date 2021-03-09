import { useDispatch, useSelector, useStore } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { ItemColor, Layer, ProfileSettingsDraft } from "app/types";
import { getValidItemColor } from "app/helpers/item";
import { getItem } from "app/data/items";
import { editorActions } from "app/store/rootDuck";
import { createDispatcher } from "app/actions/createDispatcher";
import { decodeProfile } from "app/helpers/profile.coder";
import { ColorParams, ItemParams } from "app/store/ducks/editor.duck.util";
import { forEachColorType, forEachLayer, isArrayEqual } from "app/helpers";
import { parseProfile } from "app/helpers/code";
import { RootState } from "app/store/store";
import { COLOR_TYPES } from "app/constants";

export function useDraftSelector() {
  return useSelector((state) => state.editor.draft);
}

const selectUnconfirmedDraft = createSelector(
  [
    (state: RootState) => state.editor.draft,
    (state: RootState) => state.editor.draftUnconfirmed,
  ],
  (draft, unconfirmedDraft) => {
    const finalDraft = JSON.parse(JSON.stringify(draft));

    forEachLayer((layer) => {
      if (unconfirmedDraft[layer].id !== "None") {
        finalDraft[layer].id = unconfirmedDraft[layer].id;
      }
      forEachColorType((type, i) => {
        const color = unconfirmedDraft[layer].colors[i];
        if (color !== null) {
          finalDraft[layer].colors[i] = color;
        }
      });
    });

    return finalDraft;
  }
);

export function useUnconfirmedDraftSelector() {
  return useSelector(selectUnconfirmedDraft);
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
        dispatch(editorActions.clearProfileData()); // reset profile ID to -1
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

    const itemColor = store.getState().editor.draft[layer].colors;
    const validItemColor = getValidItemColor(item, itemColor);

    if (!isArrayEqual(itemColor, validItemColor)) {
      dispatch(
        editorActions.setItemColor({ itemColor: validItemColor, layer })
      );
    }
  };
}

export const useSingleItemColorDispatcher = createDispatcher(
  editorActions.setSingleItemColor
);

export function useDraftItemDispatcher() {
  const dispatch = useDispatch();
  const store = useStore();

  return (itemParams: ItemParams) => {
    const { id, layer } = itemParams;
    const item = getItem(id);
    const draft = {
      [layer]: { id, colors: [null, null, null] as ItemColor },
    };
    const itemColor = store.getState().editor.draft[layer].colors;
    const validItemColor = getValidItemColor(item, itemColor);

    if (!isArrayEqual(itemColor, validItemColor)) {
      draft[layer].colors = validItemColor;
    }

    dispatch(editorActions.setDraftItems(draft));
  };
}

export function useDraftColorDispatcher() {
  const dispatch = useDispatch();

  return (params: ColorParams) => {
    const { layer, type, name } = params;
    const draft = {
      [layer]: { colors: [null, null, null] as ItemColor },
    };
    draft[layer].colors[COLOR_TYPES.indexOf(type)] = name;

    dispatch(editorActions.setDraftItems(draft));
  };
}

export function useParseProfileFromText() {
  const dispatch = useDispatch();

  return (code: string) => {
    const profile = parseProfile(code);

    forEachLayer((layer) => {
      const { id, colors } = profile[layer];
      const item = getItem(id);
      const validItemColor = getValidItemColor(item, colors);

      if (!isArrayEqual(colors, validItemColor)) {
        profile[layer].colors = validItemColor;
      }
    });

    dispatch(editorActions.clearProfileData());
    dispatch(editorActions.setAllItems(profile));
  };
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { MigrationManifest } from "redux-persist/es/types";
import { createMigrate } from "redux-persist";
import { PersistConfig, persistReducer } from "app/store/persist";
import { Gender, getItem, getOppositeGender, NULL_ITEM } from "app/data/items";
import { COLOR_TYPES, DefaultGroup } from "app/constants";
import {
  GroupID,
  ProfileData,
  ProfileSettings,
  ProfileSettingsDraft,
} from "app/types";
import {
  ColorParams,
  defaultDraft,
  defaultProfile,
  EditorState,
  ItemParams,
  setAllItems,
  SetItemColorParams,
  setName,
} from "app/store/ducks/editor.duck.util";
import { forEachLayer } from "app/helpers";
import { getGender, getItems } from "app/helpers/item";
import { randomArrItem, randomItemColors } from "app/helpers/random";

export const initialState: EditorState = {
  ID: -1,
  // ready to save draft
  draft: defaultProfile.male,
  // when hovering on the options without selecting. Not ready to save
  draftUnconfirmed: defaultDraft,
  isDirty: false,
  isValid: true,
  groupID: DefaultGroup.ID,
};

const slice = createSlice({
  initialState,
  name: "editor",
  reducers: {
    setDirty(state, action: PayloadAction<boolean>) {
      state.isDirty = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      setName(state, action.payload);
    },
    setGender(state, action: PayloadAction<Gender>) {
      const gender = action.payload;
      state.draft.gender = gender;
      state.isDirty = true;

      forEachLayer((layer) => {
        const itemId = state.draft[layer].id;
        const item = getItem(itemId);

        if (itemId !== "None" && item.gender !== gender) {
          const opposite = getOppositeGender(item);
          if (opposite.id !== item.id) {
            state.draft[layer].id = opposite.id;
          }
        }
      });
    },
    setItem(state, action: PayloadAction<ItemParams>) {
      const { layer, id } = action.payload;

      state.draft[layer].id = id;
      state.isDirty = true;
    },
    setSingleItemColor(state, action: PayloadAction<ColorParams>) {
      const { layer, type, name } = action.payload;

      state.draft[layer].colors[COLOR_TYPES.indexOf(type)] = name;
      state.isDirty = true;
    },
    setItemColor(state, action: PayloadAction<SetItemColorParams>) {
      const { layer, itemColor } = action.payload;

      state.draft[layer].colors = itemColor;
      state.isDirty = true;
    },
    setAllItems(
      state,
      action: PayloadAction<Partial<ProfileSettings> | undefined>
    ) {
      const profile = action.payload;
      setAllItems(state, profile);
    },
    setDraftItems(state, action: PayloadAction<Partial<ProfileSettingsDraft>>) {
      const draft = action.payload;

      forEachLayer((layer) => {
        if (draft[layer]?.id) {
          state.draftUnconfirmed[layer].id = draft[layer]?.id!;
        }
        if (draft[layer]?.colors) {
          state.draftUnconfirmed[layer].colors = draft[layer]?.colors!;
        }
      });
    },
    setRandomProfile(state) {
      const { gender } = state.draft; // @ts-ignore
      const profile: ProfileSettings = {};

      // TODO: move to action
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

        profile[layer] = {
          id: item.id,
          colors: itemColors,
        };
      });

      setAllItems(state, profile);
    },
    setProfileData(state, action: PayloadAction<ProfileData>) {
      const { ID, profile } = action.payload;

      state.ID = ID;
      setAllItems(state, profile);
    },
    clearProfileData(state) {
      state.ID = -1;
      setAllItems(state, undefined);
      state.isDirty = false;
      state.isValid = true;
    },
    setGroup(state, action: PayloadAction<GroupID>) {
      state.groupID = action.payload;
    },
  },
});

const migrations: MigrationManifest = {
  2: () => {
    console.log("change slice name from profile to editor");
    localStorage.clear();
    window.location.replace(window.location.pathname);
    return initialState as any;
  },
  3: () => initialState as any,
  4: () => initialState as any,
  5: () => initialState as any,
};

const persistConfig: PersistConfig<EditorState> = {
  storage,
  version: 5,
  key: "editor",
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

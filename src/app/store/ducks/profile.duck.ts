import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { MigrationManifest } from "redux-persist/es/types";
import { createMigrate } from "redux-persist";
import { PersistConfig, persistReducer } from "app/store/persist";
import { Gender, getItem, getOppositeGender, ItemID } from "app/data/items";
import { ColorName } from "app/data/colors";
import { COLOR_TYPES, Genders } from "app/constants";
import { ColorType, Layer, ProfileSettings } from "app/types";
import { defaultProfile } from "app/store/ducks/profile.duck.util";
import { forEachLayer } from "app/helpers";

export interface ProfileState {
  current: ProfileSettings;
  isDirty: boolean;
}

export const initialState: ProfileState = {
  current: defaultProfile.male,
  isDirty: false,
};

type ItemParams = { layer: Layer; id: ItemID };
type ColorParams = { layer: Layer; type: ColorType; name: ColorName };

const slice = createSlice({
  initialState,
  name: "profile",
  reducers: {
    setDirty(state, action: PayloadAction<boolean>) {
      state.isDirty = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.current.name = action.payload;
      state.isDirty = true;
    },
    setGender(state, action: PayloadAction<Gender>) {
      const gender = action.payload;
      state.current.gender = gender;
      state.isDirty = true;

      forEachLayer((layer) => {
        const itemId = state.current[layer].id;
        const item = getItem(itemId);

        if (itemId !== "None" && item.gender !== gender) {
          const opposite = getOppositeGender(item);
          if (opposite.id !== item.id) {
            state.current[layer].id = opposite.id;
          }
        }
      });
    },
    setItem(state, action: PayloadAction<ItemParams>) {
      const { layer, id } = action.payload;

      state.current[layer].id = id;
      state.isDirty = true;
    },
    setItemColors(state, action: PayloadAction<ColorParams>) {
      const { layer, type, name } = action.payload;

      state.current[layer].colors[COLOR_TYPES.indexOf(type)] = name;
      state.isDirty = true;
    },
    setAllItems(
      state,
      action: PayloadAction<Partial<ProfileSettings> | undefined>
    ) {
      const profileSettings = action.payload;

      if (profileSettings) {
        if (profileSettings.name) {
          state.current.name = profileSettings.name;
        }
        if (profileSettings.gender !== undefined) {
          state.current.gender = profileSettings.gender;
        }

        forEachLayer((layer) => {
          if (profileSettings[layer]) {
            // TODO: optimize, don't emit all events every time
            // @ts-ignore
            state.current[layer] = profileSettings[layer];
          }
        });
      } else {
        if (state.current.gender === Genders.male) {
          state.current = defaultProfile.male;
        } else {
          state.current = defaultProfile.female;
        }
      }

      state.isDirty = true;
    },
  },
});

function updateCurrent(state) {
  if (!state) return undefined;
  return {
    ...state,
    current: { ...initialState.current, ...state.current },
  };
}
const migrations: MigrationManifest = {
  0: (state) => state,
  1: updateCurrent,
  2: updateCurrent,
  3: (state) => initialState as any,
};

const persistConfig: PersistConfig<ProfileState> = {
  storage,
  version: 3,
  key: "profile",
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

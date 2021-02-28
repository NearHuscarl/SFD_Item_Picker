import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { MigrationManifest } from "redux-persist/es/types";
import { createMigrate } from "redux-persist";
import { PersistConfig, persistReducer } from "app/store/persist";
import {
  Gender,
  getItem,
  getOppositeGender,
  ItemID,
  NULL_ITEM,
} from "app/data/items";
import { ColorName } from "app/data/colors";
import { COLOR_TYPES } from "app/constants";
import { ColorType, Layer, ProfileData, ProfileSettings } from "app/types";
import {
  defaultProfile,
  ProfileState,
  setAllItems,
  setName,
} from "app/store/ducks/profile.duck.util";
import { forEachLayer } from "app/helpers";
import { getGender, getItems } from "app/helpers/item";
import { randomArrItem, randomItemColors } from "app/helpers/random";

export const initialState: ProfileState = {
  ID: -1,
  current: defaultProfile.male,
  isDirty: false,
  isValid: true,
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
      setName(state, action.payload);
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
      const profile = action.payload;
      setAllItems(state, profile);
    },
    setRandomProfile(state) {
      const { gender } = state.current; // @ts-ignore
      const profile: ProfileSettings = {};

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
    },
  },
});

const migrations: MigrationManifest = {
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

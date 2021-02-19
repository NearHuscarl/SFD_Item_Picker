import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { MigrationManifest } from "redux-persist/es/types";
import { createMigrate } from "redux-persist";
import camelCase from "lodash/camelCase";
import { PersistConfig, persistReducer } from "app/store/persist";
import { Gender, ItemID } from "app/data/items";
import { ColorName } from "app/data/colors";
import { COLOR_TYPES, Genders } from "app/constants";
import { ColorType, Layer, ProfileSettings } from "app/types";

export interface ProfileState {
  current: ProfileSettings;
}

export const initialState: ProfileState = {
  current: {
    name: "near",
    gender: Genders.male,
    skin: "Normal",
    skinColors: ["Skin3", null, null],
    head: "None",
    headColors: [null, null, null],
    chestOver: "None",
    chestOverColors: [null, null, null],
    chestUnder: "SleevelessShirt",
    chestUnderColors: [null, null, null],
    hands: "None",
    handsColors: [null, null, null],
    waist: "None",
    waistColors: [null, null, null],
    legs: "PantsBlack",
    legsColors: ["ClothingBlue", null, null],
    feet: "ShoesBlack",
    feetColors: ["ClothingBrown", null, null],
    accessory: "None",
    accessoryColors: [null, null, null],
  },
};

type ItemParams = { layer: Layer; id: ItemID };
type ColorParams = { layer: Layer; type: ColorType; name: ColorName };

const slice = createSlice({
  initialState,
  name: "profile",
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.current.name = action.payload;
    },
    setGender(state, action: PayloadAction<Gender>) {
      state.current.gender = action.payload;
    },
    setItem(state, action: PayloadAction<ItemParams>) {
      const { layer, id } = action.payload;
      const getter = camelCase(layer);

      state.current[getter] = id;
    },
    setAllItems(
      state,
      action: PayloadAction<Partial<ProfileSettings> | undefined>
    ) {
      const profileSettings = action.payload;

      if (profileSettings) {
        Object.keys(profileSettings).forEach((getter) => {
          if (profileSettings[getter]) {
            state.current[getter] = profileSettings[getter];
          }
        });
      } else {
        state.current = initialState.current;
      }
    },
    setItemColors(state, action: PayloadAction<ColorParams>) {
      const { layer, type, name } = action.payload;
      const getter = `${camelCase(layer)}Colors`;
      const currentColors = state.current[getter];
      const newColors = [...currentColors];

      newColors[COLOR_TYPES.indexOf(type)] = name;
      state.current[getter] = newColors;
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
};

const persistConfig: PersistConfig<ProfileState> = {
  storage,
  version: 2,
  key: "profile",
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

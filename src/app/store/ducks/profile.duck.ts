import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { MigrationManifest } from "redux-persist/es/types";
import { createMigrate } from "redux-persist";
import camelCase from "lodash/camelCase";
import { PersistConfig, persistReducer } from "app/store/persist";
import { genders, Gender, ItemID } from "app/data/items";
import { ColorName } from "app/data/colors";
import { COLOR_TYPES } from "app/constants";
import { ColorType, ItemColor, Layer } from "app/types";

export interface ProfileState {
  current: {
    gender: Gender;
    skin: ItemID;
    skinColors: ItemColor;
    head: ItemID;
    headColors: ItemColor;
    chestOver: ItemID;
    chestOverColors: ItemColor;
    chestUnder: ItemID;
    chestUnderColors: ItemColor;
    hands: ItemID;
    handsColors: ItemColor;
    waist: ItemID;
    waistColors: ItemColor;
    legs: ItemID;
    legsColors: ItemColor;
    feet: ItemID;
    feetColors: ItemColor;
    accessory: ItemID;
    accessoryColors: ItemColor;
  };
}

export const initialState: ProfileState = {
  current: {
    gender: genders.male,
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

type ColorParams = { layer: Layer; type: ColorType; name: ColorName };

const slice = createSlice({
  initialState,
  name: "profile",
  reducers: {
    setGender(state, action: PayloadAction<Gender>) {
      state.current.gender = action.payload;
    },
    setSkin(state, action: PayloadAction<ItemID>) {
      state.current.skin = action.payload;
    },
    setHead(state, action: PayloadAction<ItemID>) {
      state.current.head = action.payload;
    },
    setChestOver(state, action: PayloadAction<ItemID>) {
      state.current.chestOver = action.payload;
    },
    setChestUnder(state, action: PayloadAction<ItemID>) {
      state.current.chestUnder = action.payload;
    },
    setHands(state, action: PayloadAction<ItemID>) {
      state.current.hands = action.payload;
    },
    setWaist(state, action: PayloadAction<ItemID>) {
      state.current.waist = action.payload;
    },
    setLegs(state, action: PayloadAction<ItemID>) {
      state.current.legs = action.payload;
    },
    setFeet(state, action: PayloadAction<ItemID>) {
      state.current.feet = action.payload;
    },
    setAccessory(state, action: PayloadAction<ItemID>) {
      state.current.accessory = action.payload;
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { createMigrate } from "redux-persist";
import { PersistConfig, persistReducer } from "app/store/persist";
import { genders, Gender, ItemID } from "app/data/items";
import { MigrationManifest } from "redux-persist/es/types";

export interface ProfileState {
  current: {
    gender: Gender;
    skin: ItemID;
    head: ItemID;
    chestOver: ItemID;
    chestUnder: ItemID;
    hands: ItemID;
    waist: ItemID;
    legs: ItemID;
    feet: ItemID;
    accessory: ItemID;
  };
}

export const initialState: ProfileState = {
  current: {
    gender: genders.male,
    skin: "Normal",
    head: "None",
    chestOver: "None",
    chestUnder: "None",
    hands: "None",
    waist: "None",
    legs: "None",
    feet: "None",
    accessory: "None",
  },
};

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
  },
});

const migrations: MigrationManifest = {
  0: (state) => state,
  1: (state) => {
    if (!state) return undefined;
    return {
      ...state,
      // @ts-ignore
      current: { ...initialState.current, ...state.current },
    };
  },
};

const persistConfig: PersistConfig<ProfileState> = {
  storage,
  version: 1,
  key: "profile",
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

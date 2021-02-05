import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";
import { gender, Gender } from "app/data/items";

export interface ProfileState {
  current: {
    gender: Gender;
  };
}

export const initialState: ProfileState = {
  current: {
    gender: gender.male,
  },
};

const slice = createSlice({
  initialState,
  name: "profile",
  reducers: {
    setGender(state, action: PayloadAction<Gender>) {
      state.current.gender = action.payload;
    },
  },
});

const persistConfig: PersistConfig<ProfileState> = {
  storage,
  key: "profile",
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

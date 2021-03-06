import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";

export interface SettingsState {
  wrapLines: boolean;
}

export const initialState: SettingsState = {
  wrapLines: false,
};

const slice = createSlice({
  initialState,
  name: "settings",
  reducers: {
    setWrapLines(state, action: PayloadAction<boolean>) {
      state.wrapLines = action.payload;
    },
  },
});

const persistConfig: PersistConfig<SettingsState> = {
  storage,
  key: "settings",
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

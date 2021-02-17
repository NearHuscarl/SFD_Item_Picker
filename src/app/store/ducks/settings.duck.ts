import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";
import { defaultValue } from "./settings.duck.util";

export interface SettingsState {
  template: {
    IProfile: string;
    GameScript: string;
  };
}

export const initialState: SettingsState = {
  template: {
    IProfile: defaultValue.IProfile,
    GameScript: defaultValue.GameScript,
  },
};

const slice = createSlice({
  initialState,
  name: "settings",
  reducers: {
    setIProfileTemplate(state, action: PayloadAction<string>) {
      state.template.IProfile = action.payload;
    },
  },
});

const persistConfig: PersistConfig<SettingsState> = {
  storage,
  key: "settings",
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

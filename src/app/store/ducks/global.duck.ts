import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";

export interface GlobalState {
  devTool: boolean;
}

export const initialState: GlobalState = {
  devTool: false,
};

const slice = createSlice({
  initialState,
  name: "global",
  reducers: {
    setDevTool(state, action: PayloadAction<boolean>) {
      state.devTool = action.payload;
    },
  },
});

const persistConfig: PersistConfig<GlobalState> = {
  storage,
  key: "global",
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

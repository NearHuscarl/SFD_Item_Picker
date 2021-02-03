import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";

export interface TestState {
  flag: boolean;
}

export const initialState: TestState = {
  flag: false,
};

const slice = createSlice({
  initialState,
  name: "test",
  reducers: {
    setFlag(state, action: PayloadAction<boolean>) {
      state.flag = action.payload;
    },
  },
});

const persistConfig: PersistConfig<TestState> = {
  storage,
  key: "test",
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

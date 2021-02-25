import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";

export type ProgressData = {
  message: string;
  progress: number;
};

export interface GlobalState {
  devTool: boolean;
  currentTab: string;
  indexedDBProgress: ProgressData;
}

export const initialState: GlobalState = {
  devTool: false,
  currentTab: "1",
  indexedDBProgress: {
    message: "",
    progress: 0,
  },
};

const slice = createSlice({
  initialState,
  name: "global",
  reducers: {
    setDevTool(state, action: PayloadAction<boolean>) {
      state.devTool = action.payload;
    },
    setCurrentTab(state, action: PayloadAction<string>) {
      state.currentTab = action.payload;
    },
    setIndexedDBProgress(state, action: PayloadAction<ProgressData>) {
      const { message, progress } = action.payload;

      state.indexedDBProgress.message = message;
      state.indexedDBProgress.progress = Number((progress * 100).toFixed(2));
    },
  },
});

const persistConfig: PersistConfig<GlobalState> = {
  storage,
  key: "global",
  blacklist: ["indexedDBProgress"],
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

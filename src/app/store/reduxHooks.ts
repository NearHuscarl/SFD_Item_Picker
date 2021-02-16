import { createSelectorHook, createStoreHook } from "react-redux";
import { RootState } from "app/store/store";

export const useSelector = createSelectorHook<RootState>();
export const useStore = createStoreHook<RootState>();

import { PersistConfig as _PersistConfig } from "redux-persist";

export { persistReducer } from "redux-persist";

export type PersistConfig<S> = Omit<
  _PersistConfig<S>,
  "blacklist" | "whitelist"
> & {
  blacklist?: Partial<keyof S>[];
  whitelist?: Partial<keyof S>[];
};

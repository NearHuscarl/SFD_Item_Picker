import {
  configureStore,
  EnhancedStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { Middleware } from "redux";
import { reducer } from "./rootDuck";

function createMiddlewares() {
  let middlewares: Middleware[] = [];

  const rtkMiddlewares = getDefaultMiddleware({
    thunk: true,
    serializableCheck: {
      // FIX: serialization issue when using redux-toolkit with redux-persist
      // https://github.com/reduxjs/redux-toolkit/issues/121#issuecomment-611641781
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  });

  middlewares = middlewares.concat(rtkMiddlewares);

  return middlewares;
}

function createStore() {
  const middlewares = createMiddlewares();

  return configureStore({
    reducer,
    middleware: middlewares,
  });
}

export const store = createStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = EnhancedStore<RootState>;

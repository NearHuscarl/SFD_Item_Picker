import * as test from "./ducks/test.duck";
import * as profile from "./ducks/profile.duck";
import * as global from "./ducks/global.duck";
import * as settings from "./ducks/settings.duck";

export const testActions = test.actions;
export const profileActions = profile.actions;
export const globalActions = global.actions;
export const settingsActions = settings.actions;

export const reducer = {
  test: test.reducer,
  profile: profile.reducer,
  global: global.reducer,
  settings: settings.reducer,
};

import * as test from "./ducks/test.duck";
import * as editor from "./ducks/editor.duck";
import * as global from "./ducks/global.duck";
import * as settings from "./ducks/settings.duck";
import * as profiles from "./ducks/profiles.duck";

export const testActions = test.actions;
export const editorActions = editor.actions;
export const globalActions = global.actions;
export const settingsActions = settings.actions;
export const profilesActions = profiles.actions;

export const reducer = {
  test: test.reducer,
  editor: editor.reducer,
  global: global.reducer,
  settings: settings.reducer,
  profiles: profiles.reducer,
};

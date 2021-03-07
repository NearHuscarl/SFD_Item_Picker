import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { MigrationManifest } from "redux-persist/es/types";
import { createMigrate } from "redux-persist";
import { PersistConfig, persistReducer } from "app/store/persist";
import { TemplateRecords, TemplateID, Template } from "app/types";
import { defaultTemplates } from "./templates.duck.util";

export interface TemplateState {
  templates: TemplateRecords;
  nextID: TemplateID;
  selected: TemplateID;
}

export const initialState: TemplateState = {
  templates: defaultTemplates,
  nextID: Object.keys(defaultTemplates).length,
  selected: 0,
};

const slice = createSlice({
  initialState,
  name: "templates",
  reducers: {
    selectTemplate(state, action: PayloadAction<TemplateID>) {
      const templateID = action.payload;
      state.selected = templateID;
    },
    addTemplate(state, action: PayloadAction<Omit<Template, "ID">>) {
      const templateData = action.payload;
      const templateID = state.nextID;

      state.templates[templateID] = {
        ID: templateID,
        ...templateData,
      };
      state.nextID++;
    },
    deleteTemplate(state, action: PayloadAction<TemplateID>) {
      const templateID = action.payload;
      delete state.templates[templateID];
    },
  },
});

const migrations: MigrationManifest = {
  1: (state) => initialState as any,
};
const persistConfig: PersistConfig<TemplateState> = {
  storage,
  key: "templates",
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

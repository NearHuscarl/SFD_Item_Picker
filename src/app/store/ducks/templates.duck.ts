import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";
import { defaultTemplates } from "./templates.duck.util";
import { TemplateRecords, TemplateID, Template } from "app/types";

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

const persistConfig: PersistConfig<TemplateState> = {
  storage,
  key: "templates",
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

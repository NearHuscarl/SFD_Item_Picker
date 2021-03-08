import { useDispatch, useSelector, useStore } from "react-redux";
import { createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fillTemplate } from "app/helpers/template";
import { ProfileID, Template, TemplateID } from "app/types";
import { useDraftSelector } from "app/actions/editor";
import { templateActions } from "app/store/rootDuck";
import { DefaultTemplate } from "app/store/ducks/templates.duck.util";
import { RootState } from "app/store/store";
import { useCallback } from "react";

export function useCodeGen() {
  const settings = useDraftSelector();
  const selected = useSelectedTemplate();
  const template = useSelector(
    (state) => state.templates.templates[selected].template
  );

  return fillTemplate(template, settings);
}
export function useCopyCodeGen() {
  const store = useStore();

  return useCallback(
    (profileID?: ProfileID) => {
      const { templates, profiles } = store.getState();
      const settings = profileID
        ? profiles.profile[profileID].profile
        : store.getState().editor.draft;
      const selected = templates.selected;
      const template = templates.templates[selected].template;

      // without setTimeout, copying does not work while closing Material-UI popover
      setTimeout(() => {
        return navigator.clipboard.writeText(fillTemplate(template, settings));
      });
    },
    [store]
  );
}
export function useCopySelectedCodeGen() {
  const copyCodeGen = useCopyCodeGen();
  const store = useStore();

  return useCallback(() => {
    const { selectedProfile, profile } = store.getState().profiles;
    const isSelected = selectedProfile !== -1;
    copyCodeGen(isSelected ? selectedProfile : undefined);
    return isSelected
      ? profile[selectedProfile].profile
      : store.getState().editor.draft;
  }, [copyCodeGen, store]);
}

export const selectTemplates = createSelector(
  (state: RootState) => state.templates.templates,
  (templates) => {
    const names = Object.keys(templates).sort((a, b) =>
      templates[a].name.localeCompare(templates[b].name)
    );
    return names.map((n) => {
      const t = templates[Number(n)];
      const { template, ...returned } = t;
      return returned;
    });
  }
);

export function useTemplateSummaries() {
  return useSelector(selectTemplates);
}

export function useTemplateGetter() {
  const store = useStore();

  return () => {
    const { templates } = store.getState().templates;
    const names = Object.keys(templates).sort((a, b) =>
      templates[a].name.localeCompare(templates[b].name)
    );
    return names.map((n) => {
      const t = templates[Number(n)];
      const { template, ...returned } = t;
      return returned;
    });
  };
}

export function useSelectedTemplate() {
  return useSelector((state) => state.templates.selected);
}

export function useSelectTemplateDispatcher() {
  const dispatch = useDispatch();

  return (id: TemplateID) => {
    dispatch(templateActions.selectTemplate(id));
  };
}

const addTemplate = createAsyncThunk(
  `templates/addTemplate`,
  async (template: Omit<Template, "ID">, { getState, dispatch }) => {
    const { nextID } = getState().templates;

    dispatch(templateActions.addTemplate(template));
    dispatch(templateActions.selectTemplate(nextID));
  }
);

export function useAddTemplateDispatcher() {
  const dispatch = useDispatch();

  return (template: Omit<Template, "ID">) => {
    dispatch(addTemplate(template));
  };
}

const deleteTemplate = createAsyncThunk(
  `templates/deleteTemplate`,
  async (id: TemplateID, { getState, dispatch }) => {
    const { selected } = getState().templates;

    if (id === selected) {
      dispatch(templateActions.selectTemplate(DefaultTemplate.ID));
    }
    dispatch(templateActions.deleteTemplate(id));
  }
);

export function useDeleteTemplateDispatcher() {
  const dispatch = useDispatch();

  return (id: TemplateID) => {
    dispatch(deleteTemplate(id));
  };
}

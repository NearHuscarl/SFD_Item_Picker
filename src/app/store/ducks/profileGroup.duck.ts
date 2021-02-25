import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";
import { ProfileCardInfo, ProfileSettings } from "app/types";
import {
  defaultProfileGroup,
  ProfileGroupState,
  validateProfile,
} from "app/store/ducks/profileGroup.duck.util";

export const initialState: ProfileGroupState = {
  entities: defaultProfileGroup,
  selectedProfile: {
    groupName: "",
    profileName: "",
  },
};

const slice = createSlice({
  initialState,
  name: "profileGroup",
  reducers: {
    updateProfile(state, action: PayloadAction<ProfileSettings>) {
      const newProfile = action.payload;
      const { groupName, profileName } = state.selectedProfile;

      if (newProfile.name !== profileName) {
        delete state.entities[groupName]![profileName];
        state.entities[groupName]![newProfile.name] = newProfile;
      } else {
        state.entities[groupName]![profileName] = newProfile;
      }
    },
    setSelectedProfile(state, action: PayloadAction<ProfileCardInfo>) {
      validateProfile(state, action.payload);
      state.selectedProfile = action.payload;
    },
    addProfile() {
      // TODO:
    },
    deleteProfile() {
      // TODO:
    },
  },
});

const persistConfig: PersistConfig<ProfileGroupState> = {
  storage,
  key: "profileGroup",
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

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

const SLICE_NAME = "profileGroup";

const slice = createSlice({
  initialState,
  name: SLICE_NAME,
  reducers: {
    updateProfile(state, action: PayloadAction<ProfileSettings>) {
      const newProfile = action.payload;
      const { groupName, profileName } = state.selectedProfile;

      if (newProfile.name !== profileName) {
        delete state.entities[groupName]![profileName];
        state.entities[groupName]![newProfile.name] = newProfile;
        state.selectedProfile.profileName = newProfile.name;
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
      // append
      // setSelected
    },
    deleteProfile() {
      // TODO:
    },
  },
});

const persistConfig: PersistConfig<ProfileGroupState> = {
  storage,
  key: SLICE_NAME,
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

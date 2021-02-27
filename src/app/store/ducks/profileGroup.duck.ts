import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";
import { defaultProfileGroup } from "app/store/ducks/profileGroup.duck.util";
import { DEFAULT_GROUP_NAME } from "app/constants";
import {
  ProfileCardInfo,
  ProfileData,
  ProfileGroupRecords,
  ProfileSettings,
} from "app/types";
import { getUniqueName } from "app/helpers";

export interface ProfileGroupState {
  entities: ProfileGroupRecords;
  selectedProfile: ProfileCardInfo;
}

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
      const {
        groupName = DEFAULT_GROUP_NAME,
        profileName = newProfile.name,
      } = state.selectedProfile;

      if (newProfile.name !== profileName) {
        delete state.entities[groupName][profileName];
        state.entities[groupName][newProfile.name] = newProfile;
        state.selectedProfile.profileName = newProfile.name;
      } else {
        state.entities[groupName][profileName] = newProfile;
      }
    },
    setSelectedProfile(state, action: PayloadAction<ProfileCardInfo>) {
      state.selectedProfile = action.payload;
    },
    addProfile(state, action: PayloadAction<ProfileData>) {
      let { groupName, profile } = action.payload;

      // default group only get defined when the saved profile doesn't belong to any groups
      if (!state.entities[groupName]) {
        state.entities[groupName] = {};
      }

      const groupRecords = state.entities[groupName];
      if (groupRecords[profile.name]) {
        // profile is from component props which is frozen
        profile = {
          ...profile,
          name: getUniqueName(profile.name, Object.keys(groupRecords)),
        };
      }

      groupRecords[profile.name] = profile;
      state.selectedProfile = {
        groupName,
        profileName: profile.name,
      };
    },
    deleteProfile(state, action: PayloadAction<ProfileCardInfo>) {
      let { groupName, profileName } = action.payload;
      delete state.entities[groupName][profileName];
    },
    addGroup(state, action: PayloadAction<string>) {
      state.entities[action.payload] = {};
    },
    deleteGroup(state, action: PayloadAction<string>) {
      // TODO: move all profiles to default group
      delete state.entities[action.payload];
    },
  },
});

const persistConfig: PersistConfig<ProfileGroupState> = {
  storage,
  key: SLICE_NAME,
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

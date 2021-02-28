import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";
import {
  initialProfiles,
  initialProfileGroup,
} from "app/store/ducks/profileGroup.duck.util";
import {
  ProfileData,
  ProfileGroupRecords,
  ProfileRecords,
  ProfileSettings,
} from "app/types";
import { DEFAULT_GROUP_NAME } from "app/constants";
import { createMigrate } from "redux-persist";
import { MigrationManifest } from "redux-persist/es/types";

export interface ProfileGroupState {
  group: ProfileGroupRecords;
  profile: ProfileRecords;
  selectedProfile: number;
  nextID: number;
}

export const initialState: ProfileGroupState = {
  group: initialProfileGroup,
  profile: initialProfiles,
  selectedProfile: -1,
  nextID: Object.keys(initialProfiles).length,
};

const SLICE_NAME = "profileGroup";

const slice = createSlice({
  initialState,
  name: SLICE_NAME,
  reducers: {
    selectProfile(state, action: PayloadAction<number>) {
      const profileID = action.payload;
      const profile = state.profile[profileID];

      if (!profile.isSelected) {
        profile.isSelected = true;
        if (state.selectedProfile !== -1) {
          state.profile[state.selectedProfile].isSelected = false;
        }
        state.selectedProfile = profile.ID;
      } else {
        profile.isSelected = false;
        state.selectedProfile = -1;
      }
    },
    addProfileToGroup(state, action: PayloadAction<ProfileData>) {
      const { groupID, ID } = action.payload;
      state.group[groupID].profiles.push(ID);
      state.profile[ID].groupID = groupID;
    },
    removeProfileFromGroup(state, action: PayloadAction<number>) {
      const ID = action.payload;
      const { groupID } = state.profile[ID];
      state.group[groupID].profiles = state.group[groupID].profiles.filter(
        (pID) => pID !== ID
      );
      state.group[DEFAULT_GROUP_NAME].profiles.push(ID);
      state.profile[ID].groupID = DEFAULT_GROUP_NAME;
    },
    addProfile(state, action: PayloadAction<ProfileSettings>) {
      const profile = action.payload;
      const profileID = state.nextID;

      state.group[DEFAULT_GROUP_NAME].profiles.push(profileID);
      state.profile[profileID] = {
        ID: profileID,
        groupID: DEFAULT_GROUP_NAME,
        isSelected: false,
        profile,
      };
      state.nextID++;
    },
    updateProfile(
      state,
      action: PayloadAction<{ ID: number; profile: ProfileSettings }>
    ) {
      const { ID, profile } = action.payload;
      state.profile[ID].profile = profile;
    },
    deleteProfile(state, action: PayloadAction<number>) {
      const ID = action.payload;
      const { groupID } = state.profile[ID];

      state.group[groupID].profiles = state.group[groupID].profiles.filter(
        (pID) => pID !== ID
      );
      delete state.profile[ID];

      if (state.selectedProfile === ID) {
        state.selectedProfile = -1;
      }
    },
    addGroup(state, action: PayloadAction<string>) {
      state.group[action.payload] = {
        ID: action.payload,
        profiles: [],
      };
    },
    deleteGroup(state, action: PayloadAction<string>) {
      // TODO: move all profiles to default group
      // TODO: can't delete default group
      delete state.group[action.payload];
    },
  },
});

const migrations: MigrationManifest = {
  1: (state) => initialState as any,
};

const persistConfig: PersistConfig<ProfileGroupState> = {
  storage,
  key: SLICE_NAME,
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

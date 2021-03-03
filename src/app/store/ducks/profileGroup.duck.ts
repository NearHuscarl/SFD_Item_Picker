import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";
import { arrayMove } from "@dnd-kit/sortable";
import { createMigrate } from "redux-persist";
import { MigrationManifest } from "redux-persist/es/types";
import { ProfileData, ProfileGroupRecords, ProfileRecords } from "app/types";
import { DEFAULT_GROUP_NAME } from "app/constants";
import {
  initialProfiles,
  initialProfileGroup,
  MoveProfileParams,
  AddProfileParams,
  UpdateProfileParams,
  ReorderProfileParams,
} from "app/store/ducks/profileGroup.duck.util";

export interface ProfileGroupState {
  group: ProfileGroupRecords;
  groupIDs: string[];
  profile: ProfileRecords;
  selectedProfile: number;
  nextID: number;
}

export const initialState: ProfileGroupState = {
  group: initialProfileGroup,
  groupIDs: Object.keys(initialProfileGroup),
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
    moveProfileToGroup(state, action: PayloadAction<MoveProfileParams>) {
      const { profileID, newGroupID } = action.payload;
      const oldGroupID = state.profile[profileID].groupID;

      state.group[oldGroupID].profiles = state.group[
        oldGroupID
      ].profiles.filter((pID) => pID !== profileID);
      state.group[newGroupID].profiles.push(profileID);
      state.profile[profileID].groupID = newGroupID;
    },
    moveProfile(state, action: PayloadAction<ReorderProfileParams>) {
      const { profileID, overID } = action.payload;
      const groupID = state.profile[profileID].groupID;
      const profiles = state.group[groupID].profiles;
      const oldIndex = profiles.indexOf(profileID);
      const newIndex = profiles.indexOf(overID);

      state.group[groupID].profiles = arrayMove(profiles, oldIndex, newIndex);
    },
    addProfile(state, action: PayloadAction<AddProfileParams>) {
      const { profile, groupID = DEFAULT_GROUP_NAME } = action.payload;
      const profileID = state.nextID;

      state.group[groupID].profiles.push(profileID);
      state.profile[profileID] = {
        ID: profileID,
        groupID: groupID,
        isSelected: false,
        profile,
      };
      state.nextID++;
    },
    updateProfile(state, action: PayloadAction<UpdateProfileParams>) {
      const { id, profile } = action.payload;
      state.profile[id].profile = profile;
    },
    deleteProfile(state, action: PayloadAction<number>) {
      const ID = action.payload;
      const { groupID } = state.profile[ID];

      state.group[groupID].profiles = state.group[groupID].profiles.filter(
        (pID) => pID !== ID
      );
      delete state.profile[ID];
    },
    addGroup(state, action: PayloadAction<string>) {
      const groupID = action.payload;

      state.group[groupID] = { ID: groupID, profiles: [] };
      state.groupIDs.push(groupID);
    },
    deleteGroup(state, action: PayloadAction<string>) {
      const groupID = action.payload;
      // TODO: move all profiles to default group
      // TODO: can't delete default group
      delete state.group[groupID];
      state.groupIDs = state.groupIDs.filter((i) => i !== groupID);
    },
  },
});

const migrations: MigrationManifest = {
  1: (state) => initialState as any,
  2: (state) => initialState as any,
};

const persistConfig: PersistConfig<ProfileGroupState> = {
  storage,
  key: SLICE_NAME,
  version: 2,
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "app/store/persist";
import { arrayMove } from "@dnd-kit/sortable";
import { createMigrate } from "redux-persist";
import { MigrationManifest } from "redux-persist/es/types";
import {
  GroupID,
  ProfileData,
  ProfileGroupRecords,
  ProfileID,
  ProfileRecords,
} from "app/types";
import {
  initialProfiles,
  initialProfileGroup,
  MoveProfileParams,
  AddProfileParams,
  UpdateProfileParams,
  ReorderProfileParams,
} from "app/store/ducks/profileGroup.duck.util";
import { DefaultGroup } from "app/constants";

export interface ProfileGroupState {
  group: ProfileGroupRecords;
  groupIDs: GroupID[];
  profile: ProfileRecords;
  selectedProfile: ProfileID;
  nextID: ProfileID;
  nextGroupID: GroupID;
}

export const initialState: ProfileGroupState = {
  group: initialProfileGroup,
  groupIDs: Object.keys(initialProfileGroup).map(Number),
  profile: initialProfiles,
  selectedProfile: -1,
  nextID: Object.keys(initialProfiles).length,
  nextGroupID: Object.keys(initialProfileGroup).length,
};

const SLICE_NAME = "profileGroup";

const slice = createSlice({
  initialState,
  name: SLICE_NAME,
  reducers: {
    selectProfile(state, action: PayloadAction<ProfileID>) {
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
    removeProfileFromGroup(state, action: PayloadAction<ProfileID>) {
      const ID = action.payload;
      const { groupID } = state.profile[ID];
      state.group[groupID].profiles = state.group[groupID].profiles.filter(
        (pID) => pID !== ID
      );
      state.group[DefaultGroup.ID].profiles.push(ID);
      state.profile[ID].groupID = DefaultGroup.ID;
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
      const { profile, groupID = DefaultGroup.ID } = action.payload;
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
    deleteProfile(state, action: PayloadAction<ProfileID>) {
      const ID = action.payload;
      const { groupID } = state.profile[ID];

      state.group[groupID].profiles = state.group[groupID].profiles.filter(
        (pID) => pID !== ID
      );
      delete state.profile[ID];
    },
    addGroup(state, action: PayloadAction<string>) {
      const groupName = action.payload;
      const groupID = state.nextGroupID;

      state.group[groupID] = { ID: groupID, name: groupName, profiles: [] };
      state.groupIDs.push(groupID);
      state.nextGroupID++;
    },
    deleteGroup(state, action: PayloadAction<GroupID>) {
      const groupID = action.payload;
      // TODO: move all profiles to default group
      // TODO: can't delete default group
      delete state.group[groupID];
      state.groupIDs = state.groupIDs.filter((i) => i !== groupID);
    },
  },
});

const migrations: MigrationManifest = {
  3: (state) => initialState as any,
};

const persistConfig: PersistConfig<ProfileGroupState> = {
  storage,
  key: SLICE_NAME,
  version: 3,
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

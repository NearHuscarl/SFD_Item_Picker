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
  RenameGroupParams,
} from "app/store/ducks/profiles.duck.util";
import { ALL_GROUP_ID, DefaultGroup } from "app/constants";

export interface ProfileGroupState {
  group: ProfileGroupRecords;
  groupIDs: GroupID[];
  isAllGroupVisible: boolean;
  profile: ProfileRecords;
  selectedProfile: ProfileID;
  nextID: ProfileID;
  nextGroupID: GroupID;
}

export const initialState: ProfileGroupState = {
  group: initialProfileGroup,
  groupIDs: Object.keys(initialProfileGroup).map(Number),
  isAllGroupVisible: true,
  profile: initialProfiles,
  selectedProfile: -1,
  nextID: Object.keys(initialProfiles).length,
  nextGroupID: Object.keys(initialProfileGroup).length,
};

const SLICE_NAME = "profiles";

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

      state.group[groupID] = {
        ID: groupID,
        name: groupName,
        profiles: [],
        isVisible: true,
      };
      state.groupIDs.push(groupID);
      state.nextGroupID++;
    },
    renameGroup(state, action: PayloadAction<RenameGroupParams>) {
      const { id, newName } = action.payload;
      state.group[id].name = newName;
    },
    deleteGroup(state, action: PayloadAction<GroupID>) {
      const groupID = action.payload;
      state.group[groupID].profiles.forEach((p) => {
        state.group[DefaultGroup.ID].profiles.push(p);
        state.profile[p].groupID = DefaultGroup.ID;
      });
      delete state.group[groupID];
      state.groupIDs = state.groupIDs.filter((i) => i !== groupID);
    },
    setGroupVisible(state, action: PayloadAction<GroupID>) {
      const groupID = action.payload;

      if (groupID === ALL_GROUP_ID) {
        state.groupIDs.forEach((groupID) => {
          state.group[groupID].isVisible = !state.isAllGroupVisible;
        });
        state.isAllGroupVisible = !state.isAllGroupVisible;
      } else {
        if (state.isAllGroupVisible) {
          state.groupIDs.forEach((groupID) => {
            state.group[groupID].isVisible = false;
          });
          state.group[groupID].isVisible = true;
          state.isAllGroupVisible = false;
        } else {
          state.group[groupID].isVisible = !state.group[groupID].isVisible;
        }
      }
    },
  },
});

const migrations: MigrationManifest = {
  4: (state) => initialState as any,
};

const persistConfig: PersistConfig<ProfileGroupState> = {
  storage,
  key: SLICE_NAME,
  version: 4,
  migrate: createMigrate(migrations, { debug: false }),
};

export const { actions } = slice;
export const reducer = persistReducer(persistConfig, slice.reducer);

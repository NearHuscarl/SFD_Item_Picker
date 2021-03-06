import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { editorActions, profilesActions } from "app/store/rootDuck";
import { GroupID, ProfileID } from "app/types";
import { groupNameComparer } from "app/helpers/profileGroup";
import { DefaultGroup } from "app/constants";

export function useProfileGroupSelector() {
  return useSelector((state) => state.profiles.group);
}

export function useVisibleGroupSelector() {
  const groupRecords = useProfileGroupSelector();
  const isDefaultAndEmpty = (id: GroupID) =>
    id === DefaultGroup.ID && groupRecords[id].profiles.length === 0;

  return Object.keys(groupRecords)
    .filter((g) => {
      const id = Number(g);
      return !isDefaultAndEmpty(id) && groupRecords[id].isVisible;
    })
    .map((g) => groupRecords[Number(g) as GroupID])
    .sort(groupNameComparer);
}

export function useGroupSummariesSelector() {
  const groupRecords = useProfileGroupSelector();
  const groupIDs = useSelector((state) => state.profiles.groupIDs);

  return (
    groupIDs
      .map((id) => ({
        id: groupRecords[id].ID,
        name: groupRecords[id].name,
        isVisible: groupRecords[id].isVisible,
      }))
      // @ts-ignore
      .sort(groupNameComparer)
  );
}

export function useAllGroupSelectSelector() {
  return useSelector((state) => state.profiles.isAllGroupVisible);
}

export function useGroupSummariesGetter() {
  const store = useStore();

  return () => {
    const { groupIDs, group } = store.getState().profiles;

    return (
      groupIDs
        .map((id) => ({
          id: group[id].ID,
          name: group[id].name,
        }))
        // @ts-ignore
        .sort(groupNameComparer)
    );
  };
}

export function useSelectedGroupNameSelector() {
  const profileID = useSelector((state) => state.profiles.selectedProfile);
  const groupID = useSelector(
    (state) => state.profiles.profile[profileID]?.groupID || -1
  );

  return useSelector((state) => state.profiles.group[groupID]?.name || "");
}

export function useProfileData(profileID: ProfileID) {
  return useSelector((state) => state.profiles.profile[profileID]) || {};
}

const selectProfile = createAsyncThunk(
  `profile/selectProfile`,
  async (profileID: ProfileID, { getState, dispatch }) => {
    const { selectedProfile } = getState().profiles;
    const isSelectAction = profileID !== selectedProfile;

    dispatch(profilesActions.selectProfile(profileID));
    if (isSelectAction) {
      const profileData = getState().profiles.profile[profileID];
      dispatch(editorActions.setProfileData(profileData));
    } else {
      dispatch(editorActions.clearProfileData());
    }
    dispatch(editorActions.setDirty(false));
  }
);

export function useSelectProfileDispatcher() {
  const dispatch = useDispatch();
  return (profileID: ProfileID) => {
    dispatch(selectProfile(profileID));
  };
}

const saveProfile = createAsyncThunk(
  `profile/saveProfile`,
  async (_, { getState, dispatch }) => {
    const profile = getState().editor.draft;
    const profileID = getState().editor.ID;

    if (profileID === -1) {
      const { nextID } = getState().profiles;
      dispatch(profilesActions.addProfile({ profile }));
      dispatch(selectProfile(nextID));
    } else {
      dispatch(profilesActions.updateProfile({ id: profileID, profile }));
      dispatch(editorActions.setDirty(false));
    }
  }
);

export function useSaveProfileDispatcher() {
  const dispatch = useDispatch();
  return () => dispatch(saveProfile());
}

const addProfile = createAsyncThunk(
  `profile/addProfile`,
  async (groupID: GroupID, { getState, dispatch }) => {
    const { nextID } = getState().profiles;
    const profile = getState().editor.draft;
    dispatch(profilesActions.addProfile({ groupID, profile }));
    dispatch(selectProfile(nextID));
  }
);

export function useAddProfileDispatcher() {
  const dispatch = useDispatch();

  return (groupID: GroupID) => {
    dispatch(addProfile(groupID));
  };
}

export function useRemoveProfileFromGroupDispatcher() {
  const dispatch = useDispatch();

  return (profileID: ProfileID) => {
    dispatch(profilesActions.removeProfileFromGroup(profileID));
  };
}

export function useMoveProfileToGroupDispatcher() {
  const dispatch = useDispatch();

  return (profileID: ProfileID, newGroupID: GroupID) => {
    dispatch(profilesActions.moveProfileToGroup({ profileID, newGroupID }));
  };
}

export function useMoveProfileDispatcher() {
  const dispatch = useDispatch();

  return (profileID: ProfileID, overID: ProfileID) => {
    dispatch(profilesActions.moveProfile({ profileID, overID }));
  };
}

const deleteProfile = createAsyncThunk(
  `profile/deleteProfile`,
  async (profileID: ProfileID, { getState, dispatch }) => {
    const { selectedProfile } = getState().profiles;

    if (profileID === selectedProfile) {
      dispatch(selectProfile(profileID)); // unselect if select
    }
    dispatch(profilesActions.deleteProfile(profileID));
  }
);

export function useDeleteProfileDispatcher() {
  const dispatch = useDispatch();

  return (profileID: ProfileID) => {
    dispatch(deleteProfile(profileID));
  };
}

export function useAddGroupDispatcher() {
  const dispatch = useDispatch();

  return (groupName: string) => {
    dispatch(profilesActions.addGroup(groupName));
  };
}

export function useDeleteGroupDispatcher() {
  const dispatch = useDispatch();

  return (groupID: GroupID) => {
    dispatch(profilesActions.deleteGroup(groupID));
  };
}

export function useSetGroupVisibleDispatcher() {
  const dispatch = useDispatch();

  return (groupID: GroupID) => {
    dispatch(profilesActions.setGroupVisible(groupID));
  };
}

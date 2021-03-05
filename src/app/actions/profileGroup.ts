import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { profileActions, profileGroupActions } from "app/store/rootDuck";
import { GroupID, ProfileID } from "app/types";
import { groupNameComparer } from "app/helpers/profileGroup";
import { DefaultGroup } from "app/constants";

export function useProfileGroupSelector() {
  return useSelector((state) => state.profileGroup.group);
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
  const groupIDs = useSelector((state) => state.profileGroup.groupIDs);

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
  return useSelector((state) => state.profileGroup.isAllGroupVisible);
}

export function useGroupSummariesGetter() {
  const store = useStore();

  return () => {
    const { groupIDs, group } = store.getState().profileGroup;

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
  const profileID = useSelector((state) => state.profileGroup.selectedProfile);
  const groupID = useSelector(
    (state) => state.profileGroup.profile[profileID]?.groupID || -1
  );

  return useSelector((state) => state.profileGroup.group[groupID]?.name || "");
}

export function useProfileData(profileID: ProfileID) {
  return useSelector((state) => state.profileGroup.profile[profileID]) || {};
}

const selectProfile = createAsyncThunk(
  `profileGroup/selectProfile`,
  async (profileID: ProfileID, { getState, dispatch }) => {
    const { selectedProfile } = getState().profileGroup;
    const isSelectAction = profileID !== selectedProfile;

    dispatch(profileGroupActions.selectProfile(profileID));
    if (isSelectAction) {
      const profileData = getState().profileGroup.profile[profileID];
      dispatch(profileActions.setProfileData(profileData));
    } else {
      dispatch(profileActions.clearProfileData());
    }
    dispatch(profileActions.setDirty(false));
  }
);

export function useSelectProfileDispatcher() {
  const dispatch = useDispatch();
  return (profileID: ProfileID) => {
    dispatch(selectProfile(profileID));
  };
}

const saveProfile = createAsyncThunk(
  `profileGroup/saveProfile`,
  async (_, { getState, dispatch }) => {
    const profile = getState().profile.current;
    const profileID = getState().profile.ID;

    if (profileID === -1) {
      const { nextID } = getState().profileGroup;
      dispatch(profileGroupActions.addProfile({ profile }));
      dispatch(selectProfile(nextID));
    } else {
      dispatch(profileGroupActions.updateProfile({ id: profileID, profile }));
      dispatch(profileActions.setDirty(false));
    }
  }
);

export function useSaveProfileDispatcher() {
  const dispatch = useDispatch();
  return () => dispatch(saveProfile());
}

const addProfile = createAsyncThunk(
  `profileGroup/addProfile`,
  async (groupID: GroupID, { getState, dispatch }) => {
    const { nextID } = getState().profileGroup;
    const profile = getState().profile.current;
    dispatch(profileGroupActions.addProfile({ groupID, profile }));
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
    dispatch(profileGroupActions.removeProfileFromGroup(profileID));
  };
}

export function useMoveProfileToGroupDispatcher() {
  const dispatch = useDispatch();

  return (profileID: ProfileID, newGroupID: GroupID) => {
    dispatch(profileGroupActions.moveProfileToGroup({ profileID, newGroupID }));
  };
}

export function useMoveProfileDispatcher() {
  const dispatch = useDispatch();

  return (profileID: ProfileID, overID: ProfileID) => {
    dispatch(profileGroupActions.moveProfile({ profileID, overID }));
  };
}

const deleteProfile = createAsyncThunk(
  `profileGroup/deleteProfile`,
  async (profileID: ProfileID, { getState, dispatch }) => {
    const { selectedProfile } = getState().profileGroup;

    if (profileID === selectedProfile) {
      dispatch(selectProfile(profileID)); // unselect if select
    }
    dispatch(profileGroupActions.deleteProfile(profileID));
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
    dispatch(profileGroupActions.addGroup(groupName));
  };
}

export function useDeleteGroupDispatcher() {
  const dispatch = useDispatch();

  return (groupID: GroupID) => {
    dispatch(profileGroupActions.deleteGroup(groupID));
  };
}

export function useSetGroupVisibleDispatcher() {
  const dispatch = useDispatch();

  return (groupID: GroupID) => {
    dispatch(profileGroupActions.setGroupVisible(groupID));
  };
}

import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { profileActions, profileGroupActions } from "app/store/rootDuck";

export function useProfileGroupSelector() {
  return useSelector((state) => state.profileGroup.group);
}

export function useSelectedGroupNameSelector() {
  const id = useSelector((state) => state.profileGroup.selectedProfile);
  return useSelector((state) => state.profileGroup.profile[id]?.groupID) || "";
}

export function useProfileData(profileID: number) {
  return useSelector((state) => state.profileGroup.profile[profileID]) || {};
}

const selectProfile = createAsyncThunk(
  `profileGroup/selectProfile`,
  async (profileID: number, { getState, dispatch }) => {
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
  return (profileID: number) => {
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
      dispatch(profileGroupActions.addProfile(profile));
      dispatch(selectProfile(nextID));
    } else {
      dispatch(profileGroupActions.updateProfile({ ID: profileID, profile }));
    }

    dispatch(profileActions.setDirty(false));
  }
);

export function useSaveProfileDispatcher() {
  const dispatch = useDispatch();
  return () => dispatch(saveProfile());
}

export function useDeleteProfileDispatcher() {
  const dispatch = useDispatch();

  return (profileID: number) => {
    dispatch(profileGroupActions.deleteProfile(profileID));
  };
}

export function useRemoveProfileDispatcher() {
  const dispatch = useDispatch();

  return (profileID: number) => {
    dispatch(profileGroupActions.removeProfileFromGroup(profileID));
  };
}

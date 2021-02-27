import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { profileActions, profileGroupActions } from "app/store/rootDuck";
import { ProfileData, ProfileSettings } from "app/types";
import { DEFAULT_GROUP_NAME } from "app/constants";

export function useProfileGroupSelector() {
  return useSelector((state) => state.profileGroup.entities);
}

export function useSelectedGroupNameSelector() {
  return useSelector((state) => state.profileGroup.selectedProfile.groupName);
}

export function useSelectedProfileSelector(
  groupName: string,
  profileName: string
) {
  const selected = useSelector((state) => state.profileGroup.selectedProfile);
  return (
    selected.groupName === groupName && selected.profileName === profileName
  );
}

const selectProfile = createAsyncThunk(
  `profileGroup/selectProfile`,
  async (profileData: ProfileData, { getState, dispatch }) => {
    const { selectedProfile } = getState().profileGroup;
    const isSelected =
      profileData.profile.name === selectedProfile.profileName &&
      profileData.groupName === selectedProfile.groupName;

    if (isSelected) {
      dispatch(
        profileGroupActions.setSelectedProfile({
          groupName: "",
          profileName: "",
        })
      );
      dispatch(profileActions.setAllItems());
    } else {
      const { groupName, profile } = profileData;
      dispatch(
        profileGroupActions.setSelectedProfile({
          groupName,
          profileName: profile.name,
        })
      );
      dispatch(profileActions.setAllItems(profile));
    }
    dispatch(profileActions.setDirty(false));
  }
);

export function useSelectProfileDispatcher() {
  const dispatch = useDispatch();

  return (groupName: string, profile: ProfileSettings) => {
    dispatch(selectProfile({ groupName, profile }));
  };
}

const saveProfile = createAsyncThunk(
  `profileGroup/saveProfile`,
  async (_, { getState, dispatch }) => {
    const newProfile = getState().profile.current;
    const { groupName } = getState().profileGroup.selectedProfile;

    if (!groupName) {
      dispatch(
        profileGroupActions.addProfile({
          groupName: DEFAULT_GROUP_NAME,
          profile: newProfile,
        })
      );
    } else {
      dispatch(profileGroupActions.updateProfile(newProfile));
    }
    dispatch(profileActions.setDirty(false));
  }
);

export function useSaveProfileDispatcher() {
  const dispatch = useDispatch();
  return () => dispatch(saveProfile());
}

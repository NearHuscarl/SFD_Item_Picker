import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { profileActions, profileGroupActions } from "app/store/rootDuck";
import { ProfileSettings } from "app/types";

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
  async (
    profileInfo: { groupName: string; profile: ProfileSettings },
    { getState, dispatch }
  ) => {
    const { selectedProfile } = getState().profileGroup;
    const isSelected =
      profileInfo.profile.name === selectedProfile.profileName &&
      profileInfo.groupName === selectedProfile.groupName;

    if (isSelected) {
      dispatch(
        profileGroupActions.setSelectedProfile({
          groupName: "",
          profileName: "",
        })
      );
      dispatch(profileActions.setAllItems());
    } else {
      const { groupName, profile } = profileInfo;
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

    dispatch(profileGroupActions.updateProfile(newProfile));
    dispatch(profileActions.setDirty(false));
  }
);

export function useSaveProfileDispatcher() {
  const dispatch = useDispatch();
  return () => dispatch(saveProfile());
}

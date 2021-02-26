import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useSelector } from "app/store/reduxHooks";
import { profileActions, profileGroupActions } from "app/store/rootDuck";
import { ProfileSettings } from "app/types";

export function useProfileGroupSelector() {
  return useSelector((state) => state.profileGroup.entities);
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

export function useSelectProfileDispatcher() {
  const dispatch = useDispatch();

  return (groupName: string, profile: ProfileSettings) => {
    dispatch(
      profileGroupActions.setSelectedProfile({
        groupName,
        profileName: profile.name,
      })
    );
    dispatch(profileActions.setAllItems(profile));
    dispatch(profileActions.setDirty(false));
  };
}

const saveProfile = createAsyncThunk(
  `botGroup/saveProfile`,
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

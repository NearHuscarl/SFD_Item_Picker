import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { editorActions, profileActions } from "app/store/rootDuck";
import { GroupID, ProfileID, ProfileSettings } from "app/types";
import { groupNameComparer } from "app/helpers/profileGroup";
import { DefaultGroup } from "app/constants";
import { RenameGroupParams } from "app/store/ducks/profiles.duck.util";
import { usePlayerTextures } from "app/actions/player";
import { encodeProfile } from "app/helpers/profile.coder";

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
  `profiles/selectProfile`,
  async (profileID: ProfileID, { getState, dispatch }) => {
    const { selectedProfile } = getState().profiles;
    const isSelectAction = profileID !== selectedProfile;

    dispatch(profileActions.selectProfile(profileID));
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
  `profiles/saveProfile`,
  async (_, { getState, dispatch }) => {
    const profile = getState().editor.draft;
    const profileID = getState().editor.ID;

    if (profileID === -1) {
      const { nextID } = getState().profiles;
      dispatch(profileActions.addProfile({ profile }));
      dispatch(selectProfile(nextID));
    } else {
      dispatch(profileActions.updateProfile({ id: profileID, profile }));
      dispatch(editorActions.setDirty(false));
    }
  }
);

export function useSaveProfileDispatcher() {
  const dispatch = useDispatch();
  return () => dispatch(saveProfile());
}

const addProfile = createAsyncThunk(
  `profiles/addProfile`,
  async (groupID: GroupID, { getState, dispatch }) => {
    const { nextID } = getState().profiles;
    const profile = getState().editor.draft;
    dispatch(profileActions.addProfile({ groupID, profile }));
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
    dispatch(profileActions.removeProfileFromGroup(profileID));
  };
}

export function useMoveProfileToGroupDispatcher() {
  const dispatch = useDispatch();

  return (profileID: ProfileID, newGroupID: GroupID) => {
    dispatch(profileActions.moveProfileToGroup({ profileID, newGroupID }));
  };
}

export function useMoveProfileDispatcher() {
  const dispatch = useDispatch();

  return (profileID: ProfileID, overID: ProfileID) => {
    dispatch(profileActions.moveProfile({ profileID, overID }));
  };
}

const deleteProfile = createAsyncThunk(
  `profiles/deleteProfile`,
  async (profileID: ProfileID, { getState, dispatch }) => {
    const { selectedProfile } = getState().profiles;

    if (profileID === selectedProfile) {
      dispatch(selectProfile(profileID)); // unselect if select
    }
    dispatch(profileActions.deleteProfile(profileID));
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
    dispatch(profileActions.addGroup(groupName));
  };
}

export function useRenameGroupDispatcher() {
  const dispatch = useDispatch();

  return (params: RenameGroupParams) => {
    dispatch(profileActions.renameGroup(params));
  };
}

export function useDeleteGroupDispatcher() {
  const dispatch = useDispatch();

  return (groupID: GroupID) => {
    dispatch(profileActions.deleteGroup(groupID));
  };
}

export function useSetGroupVisibleDispatcher() {
  const dispatch = useDispatch();

  return (groupID: GroupID) => {
    dispatch(profileActions.setGroupVisible(groupID));
  };
}

export function useProfileImageDownloader() {
  const { getRenderer, loadTextures } = usePlayerTextures();

  return (profile: ProfileSettings) => {
    loadTextures(profile).then((success) => {
      if (success) {
        const canvas = document.createElement("canvas")!;

        canvas.width = 69;
        canvas.height = 75;

        const render = getRenderer();
        render({ canvas, scale: 3 });

        const link = document.createElement("a");
        link.download = `${profile.name}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    });
  };
}

export function useSelectedProfileDownloader() {
  const download = useProfileImageDownloader();
  const store = useStore();

  return (profileID?: ProfileID) => {
    let profile: ProfileSettings;

    if (profileID) {
      profile = store.getState().profiles.profile[profileID].profile;
    } else {
      profile = store.getState().editor.draft;
    }
    download(profile);
  };
}

export function useShareSelectedProfile() {
  const store = useStore();

  return (profileID?: ProfileID) => {
    let profile: ProfileSettings;

    if (profileID) {
      profile = store.getState().profiles.profile[profileID].profile;
    } else {
      profile = store.getState().editor.draft;
    }
    setTimeout(() => {
      const urlParams = encodeProfile(profile);
      return navigator.clipboard.writeText(
        window.location.host + "?p=" + urlParams
      );
    });

    return profile;
  };
}

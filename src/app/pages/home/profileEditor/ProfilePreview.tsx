import { useCallback, useReducer } from "react";
import throttle from "lodash/throttle";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { IconButton } from "@material-ui/core";
import Casino from "@material-ui/icons/Casino";
import GetApp from "@material-ui/icons/GetApp";
import purple from "@material-ui/core/colors/purple";
import { globalActions } from "app/store/rootDuck";
import { Player } from "app/widgets/Player";
import { useOnMount } from "app/helpers/hooks";
import {
  useRandomItemDispatcher,
  useUnconfirmedDraftSelector,
} from "app/actions/editor";
import { ShareButton } from "app/widgets/ShareButton";
import { AddToGroupButton } from "app/pages/home/profileEditor/AddToGroupButton";
import { useProfileImageDownloader } from "app/actions/profile";
import { CreateNewProfileButton } from "app/pages/home/profileEditor/CreateNewProfileButton";

const useStyles = makeStyles((theme) => ({
  profilePreview: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "darkorchid",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    // prevent mecha head from being clipped
    height: 90,

    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "50%",
      backgroundColor: purple[100],
      borderTopLeftRadius: "inherit",
      borderTopRightRadius: "inherit",
    },
  },
  action: {
    position: "absolute",
    top: 5,
    right: 5,

    '& > [class*="MuiButtonBase"]': {
      padding: 5,
      color: purple[800],
    },
  },
  actionLeft: {
    position: "absolute",
    top: 5,
    left: 5,

    '& > [class*="MuiButtonBase"]': {
      padding: 5,
      color: purple[800],
    },
  },
}));

function useProfilePreview() {
  const classes = useStyles();
  const profile = useUnconfirmedDraftSelector();
  const dispatch = useDispatch();
  const devTool = useSelector((state) => state.global.devTool);
  const [, rerender] = useReducer((x) => ++x, 0);
  const onRandomize = useCallback(throttle(useRandomItemDispatcher(), 500), []);
  const onClickProfile = (e) => {
    // display hidden devtool after triple-clicking profile
    if (e.detail === 3) {
      dispatch(globalActions.setDevTool(!devTool));
    }
  };

  const downloadProfile = useProfileImageDownloader();
  const onDownload = () => {
    downloadProfile(profile);
  };

  useOnMount(() => {
    const btnEl = document.getElementById(
      "render-profile-devtool-btn"
    ) as HTMLButtonElement;
    btnEl.addEventListener("click", rerender);
    return () => btnEl.removeEventListener("click", rerender);
  });

  return {
    classes,
    onClickProfile,
    onRandomize,
    onDownload,
    profile,
  };
}

export function ProfilePreview() {
  const {
    classes,
    onClickProfile,
    onRandomize,
    onDownload,
    profile,
  } = useProfilePreview();

  return (
    <div onClick={onClickProfile} className={classes.profilePreview}>
      <Player profile={profile} />
      <div className={classes.actionLeft}>
        <CreateNewProfileButton />
        <AddToGroupButton />
      </div>
      <div className={classes.action}>
        <IconButton
          title="download profile image"
          aria-label="download profile image"
          onClick={onDownload}
        >
          <GetApp />
        </IconButton>
        <ShareButton />
        <IconButton
          color="primary"
          title="randomize profile"
          aria-label="randomize profile"
          onClick={onRandomize}
        >
          <Casino />
        </IconButton>
      </div>
    </div>
  );
}

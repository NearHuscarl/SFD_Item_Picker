import { useReducer } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { IconButton } from "@material-ui/core";
import Casino from "@material-ui/icons/Casino";
import { globalActions } from "app/store/rootDuck";
import { useSelector } from "app/store/reduxHooks";
import { Portrait } from "app/widgets/Portrait";
import { useOnMount } from "app/helpers/hooks";
import { useRandomItemDispatcher } from "app/actions/profile";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "darkorchid",
    position: "relative",
  },
  action: {
    position: "absolute",
    top: -40,
    right: -14,
  },
});

function useProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const devTool = useSelector((state) => state.global.devTool);
  const [, rerender] = useReducer((x) => ++x, 0);
  const onRandomize = useRandomItemDispatcher();
  const onClickProfile = (e) => {
    // display hidden devtool after triple-clicking profile
    if (e.detail === 3) {
      dispatch(globalActions.setDevTool(!devTool));
    }
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
  };
}

export function Profile() {
  const { classes, onClickProfile, onRandomize } = useProfile();

  return (
    <div onClick={onClickProfile} className={classes.root}>
      <Portrait />
      <div className={classes.action}>
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

import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { ProfileEditor } from "app/pages/home/profileEditor/ProfileEditor";
import { Content } from "app/pages/home/Content";
import { useSearchItemDispatcher } from "app/actions/editor";
import { DevTool } from "app/widgets/DevTool";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    display: "flex",
    backgroundColor: grey[100],
  },
  colLeft: {
    flex: "0 0 333px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: theme.spacing(2),
    paddingRight: 0, // fix swatch's box-shadows on the right are being clipped
    backgroundColor: "white",
    boxShadow: theme.shadows[10],
  },
  colRight: {
    flexGrow: 1,
  },
}));

function useHomePage() {
  const dispatchSearchItems = useSearchItemDispatcher();

  useEffect(() => {
    dispatchSearchItems(window.location.search);
  }, [window.location.search]);
}

export function HomePage() {
  const classes = useStyles();

  useHomePage();

  return (
    <div className={classes.container}>
      <div className={classes.colLeft}>
        <ProfileEditor />
      </div>
      <div className={classes.colRight}>
        <Content />
      </div>
      <DevTool />
    </div>
  );
}

import { Box, makeStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { Profile } from "app/pages/home/Profile";
import { ProfileSettings } from "app/pages/home/ProfileSettings";
import { DevTool } from "app/widgets/DevTool";
import { CodeGen } from "app/pages/home/CodeGen";
import { useEffect } from "react";
import { useSearchItemDispatcher } from "app/actions/profile";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    display: "flex",
    backgroundColor: grey[100],
  },
  colLeft: {
    flex: "0 0 300px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: theme.spacing(2),
    // prevent mecha head from being clipped
    paddingTop: 45,
    backgroundColor: "white",
    boxShadow: theme.shadows[10],
  },
  colRight: {
    flexGrow: 1,
    display: "flex",
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
        <Box marginBottom={2}>
          <Profile />
        </Box>
        <ProfileSettings />
      </div>
      <div className={classes.colRight}>
        <CodeGen />
      </div>
      <DevTool />
    </div>
  );
}

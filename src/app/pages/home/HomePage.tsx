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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 45,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: 400,
    backgroundColor: "white",
    boxShadow: theme.shadows[10],
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
      <CodeGen />
      <DevTool />
    </div>
  );
}

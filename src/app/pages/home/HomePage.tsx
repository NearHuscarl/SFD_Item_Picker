import { useEffect } from "react";
import { Box, makeStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { Profile } from "app/pages/home/Profile";
import { ProfileSettings } from "app/pages/home/ProfileSettings";
import { useSearchItemDispatcher } from "app/actions/profile";
import { DevTool } from "app/widgets/DevTool";
import { Content } from "app/pages/home/Content";

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
        <Box marginBottom={2} marginRight={2}>
          <Profile />
        </Box>
        <ProfileSettings />
      </div>
      <div className={classes.colRight}>
        <Content />
      </div>
      <DevTool />
    </div>
  );
}

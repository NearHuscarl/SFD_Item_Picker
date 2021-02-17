import { Box, makeStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { Profile } from "app/widgets/Profile";
import { ProfileSettings } from "app/pages/home/ProfileSettings";
import { DevTool } from "app/widgets/DevTool";
import { CodeGen } from "app/pages/home/CodeGen";

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
    width: 315,
    backgroundColor: "white",
    boxShadow: theme.shadows[10],
  },
}));

export function HomePage() {
  const classes = useStyles();

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

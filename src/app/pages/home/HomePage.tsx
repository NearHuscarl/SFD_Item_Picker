import { Box, makeStyles } from "@material-ui/core";
import { Profile } from "app/widgets/Profile";
import { ProfileSettings } from "app/pages/home/ProfileSettings";
import { DevTool } from "app/widgets/DevTool";
import { CodeGen } from "app/pages/home/CodeGen";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    "& > *": {
      marginRight: theme.spacing(2),
    },
  },
}));

export function HomePage() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: 45,
          marginLeft: 10,
          width: 315,
        }}
      >
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

import { Box } from "@material-ui/core";
import { Profile } from "app/widgets/Profile";
import { ProfileSettings } from "app/pages/home/ProfileSettings";
import { DevTool } from "app/widgets/DevTool";

export function HomePage() {
  return (
    <div>
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
      <DevTool />
    </div>
  );
}

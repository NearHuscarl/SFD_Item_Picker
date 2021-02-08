import { Box, Button } from "@material-ui/core";
import { Profile } from "app/widgets/Profile";
import { ProfileSettings } from "app/pages/home/ProfileSettings";
import { useSelector } from "app/store/reduxHooks";

function ProfilePicture() {
  const settings = useSelector((state) => state.profile.current);

  return <Profile settings={settings} />;
}

export function HomePage() {
  const onReset = () => {
    localStorage.clear();
    window.location.reload();
  };

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
          <ProfilePicture />
        </Box>
        <ProfileSettings />
      </div>
      {/*<Button*/}
      {/*  onClick={onReset}*/}
      {/*  style={{ position: "absolute", right: 0, top: 0 }}*/}
      {/*>*/}
      {/*  reset*/}
      {/*</Button>*/}
    </div>
  );
}

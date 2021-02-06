import { Box } from "@material-ui/core";
import { Profile } from "app/widgets/Profile";
import { ProfileSettings } from "app/pages/home/ProfileSettings";
import { useSelector } from "app/store/reduxHooks";

function ProfilePicture() {
  const skin = useSelector((state) => state.profile.current.skin);
  const head = useSelector((state) => state.profile.current.head);
  const chestOver = useSelector((state) => state.profile.current.chestOver);
  const chestUnder = useSelector((state) => state.profile.current.chestUnder);
  const hands = useSelector((state) => state.profile.current.hands);
  const waist = useSelector((state) => state.profile.current.waist);
  const legs = useSelector((state) => state.profile.current.legs);
  const feet = useSelector((state) => state.profile.current.feet);
  const accessory = useSelector((state) => state.profile.current.accessory);

  return (
    <Profile
      skin={skin}
      head={head}
      chestOver={chestOver}
      chestUnder={chestUnder}
      hands={hands}
      waist={waist}
      legs={legs}
      feet={feet}
      accessory={accessory}
    />
  );
}

export function HomePage() {
  return (
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
  );
}

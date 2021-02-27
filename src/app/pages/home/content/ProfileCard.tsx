import { Card, Typography } from "@material-ui/core";
import { ProfileSettings } from "app/types";
import { Player } from "app/widgets/Player";
import { makeStyles } from "@material-ui/core";
import { memo } from "react";
import { isProfileEqual } from "app/helpers/profile";
import {
  useSelectedProfileSelector,
  useSelectProfileDispatcher,
} from "app/actions/profileGroup";
import clsx from "clsx";

export const PROFILE_CARD_WIDTH = 100;
export const PROFILE_CARD_HEIGHT = 130;

const useStyles = makeStyles((theme) => ({
  profileCard: {
    width: PROFILE_CARD_WIDTH,
    height: PROFILE_CARD_HEIGHT,
    transition: theme.transitions.create(["box-shadow", "background-color"]),

    "&:hover": {
      cursor: "pointer",
      boxShadow: theme.shadows[6],
    },
  },
  profileCardSelected: {
    backgroundColor: theme.palette.primary[50],
    color: theme.palette.primary[800],
  },
  name: {
    textAlign: "center",
    fontWeight: 600,
  },
  player: {
    marginTop: theme.spacing(1),
    marginBottom: 0,
    marginLeft: 28,
    marginRight: 0,
  },
}));

export const ProfileCard = memo(
  (props: ProfileCardProps) => {
    const { groupName, profile } = props;
    const classes = useStyles();
    const dispatchSelectProfile = useSelectProfileDispatcher();
    const isSelected = useSelectedProfileSelector(groupName, profile.name);

    return (
      <Card
        className={clsx({
          [classes.profileCard]: true,
          [classes.profileCardSelected]: isSelected,
        })}
        onClick={() => dispatchSelectProfile(groupName, profile)}
      >
        <div className={classes.player}>
          <Player profile={profile} aniFrameIndex={0} scale={3} />
        </div>
        <Typography className={classes.name} variant="body1">
          {profile.name}
        </Typography>
      </Card>
    );
  },
  (props1, props2) => isProfileEqual(props1.profile, props2.profile)
);
ProfileCard.displayName = "ProfileCard";

type ProfileCardProps = {
  groupName: string;
  profile: ProfileSettings;
};

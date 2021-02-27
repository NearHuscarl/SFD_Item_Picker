import { ReactNode } from "react";
import { Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ProfileCard } from "app/pages/home/content/ProfileCard";
import { ProfileSettings } from "app/types";

const GROUP_NAME_HEIGHT = 35;

const useStyles = makeStyles<Theme>((theme) => ({
  groupName: {
    fontWeight: 700,
    height: GROUP_NAME_HEIGHT,
  },
  groupContent: {
    display: "flex",
    flexFlow: "wrap",
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),

    "& > *": {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
}));

export function ProfileGroup(props: ProfileGroupProps) {
  const { groupName, profileRecords } = props;
  const classes = useStyles();
  let children: ReactNode[] = ["There is no profile in this group"];

  if (profileRecords && Object.keys(profileRecords).length > 0) {
    children = Object.keys(profileRecords).map((profileName) => (
      <ProfileCard
        key={profileName}
        groupName={groupName}
        profile={profileRecords[profileName]}
      />
    ));
  }

  return (
    <div>
      <Typography className={classes.groupName} variant="h6" component="h2">
        {groupName}
      </Typography>
      <div className={classes.groupContent}>{children}</div>
    </div>
  );
}

type ProfileGroupProps = {
  groupName: string;
  profileRecords: Record<string, ProfileSettings> | undefined;
};

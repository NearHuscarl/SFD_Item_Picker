import { ReactNode } from "react";
import { Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ProfileCard } from "app/pages/home/content/ProfileCard";
import { ProfileGroup } from "app/types";
import { DEFAULT_GROUP_NAME } from "app/constants";

const GROUP_NAME_HEIGHT = 35;

const useStyles = makeStyles((theme) => ({
  groupName: {
    fontWeight: 700,
    height: GROUP_NAME_HEIGHT,
    display: "inline-block",
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

export function ProfileCardGroup(props: ProfileCardGroupProps) {
  const { name: groupName, profiles } = props;
  const classes = useStyles();
  let children: ReactNode[] = ["There is no profile in this group"];

  if (profiles.length > 0) {
    children = profiles.map((profileID) => (
      <ProfileCard key={profileID} id={profileID} />
    ));
  }

  let title = (
    <Typography className={classes.groupName} variant="h6" component="h2">
      {groupName}
    </Typography>
  );

  if (groupName === DEFAULT_GROUP_NAME) {
    title = (
      <Tooltip
        title={`Profiles don't belong to any groups will be put in '${DEFAULT_GROUP_NAME}'`}
        arrow
      >
        {title}
      </Tooltip>
    );
  }

  return (
    <div>
      {title}
      <div className={classes.groupContent}>{children}</div>
    </div>
  );
}

type ProfileCardGroupProps = {
  name: string;
  profiles: number[];
};

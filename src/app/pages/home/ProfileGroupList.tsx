import { ReactNode } from "react";
import { Paper, Theme, Typography } from "@material-ui/core";
import { useProfileGroupSelector } from "app/actions/profileGroup";
import { ProfileCard } from "app/pages/home/ProfileCard";
import { ProfileSettings } from "app/types";
import { makeStyles } from "@material-ui/styles";
import { Virtuoso } from "react-virtuoso";

const GROUP_NAME_HEIGHT = 35;
const TAB_LIST_HEIGHT = 48;

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

function ProfileGroup(props: ProfileGroupProps) {
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

const useStyles2 = makeStyles<Theme>((theme) => ({
  profileGroupRoot: {
    height: `calc(100vh - ${TAB_LIST_HEIGHT}px - 32px)`,
    display: "flex",
    flexDirection: "column",
  },
  profileGroupList: {
    height: "100%",
    position: "relative",
    paddingLeft: theme.spacing(2),

    "&:before, &:after": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    },
    "&:before": {
      boxShadow: "inset 0 7px 8px -10px rgba(0,0,0,0.4)",
    },
    "&:after": {
      boxShadow: "inset 0 -7px 8px -10px rgba(0,0,0,0.4)",
    },

    '& [data-index="0"]': {
      marginTop: theme.spacing(2),
    },
  },
}));

export function ProfileGroupList() {
  const classes = useStyles2();
  const groupRecords = useProfileGroupSelector();
  const groupNames = Object.keys(groupRecords);

  return (
    <Paper className={classes.profileGroupRoot} elevation={0}>
      {/*TODO: add group filter*/}
      {/*<div style={{ height: 80, backgroundColor: "pink" }}>GAY</div>*/}
      <div className={classes.profileGroupList}>
        <Virtuoso
          data={groupNames}
          overscan={1}
          // height of 1 row of ProfileCard
          defaultItemHeight={197}
          itemContent={(index, groupName) => {
            return (
              <ProfileGroup
                key={groupName}
                groupName={groupName}
                profileRecords={groupRecords[groupName]}
              />
            );
          }}
        />
      </div>
    </Paper>
  );
}

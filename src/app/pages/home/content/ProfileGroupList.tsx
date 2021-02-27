import { Paper, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Virtuoso } from "react-virtuoso";
import { useProfileGroupSelector } from "app/actions/profileGroup";
import { ProfileGroup } from "app/pages/home/content/ProfileGroup";

const TAB_LIST_HEIGHT = 48;

const useStyles = makeStyles<Theme>((theme) => ({
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
      zIndex: 1, // add box-shadow to scrollbar
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
  const classes = useStyles();
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

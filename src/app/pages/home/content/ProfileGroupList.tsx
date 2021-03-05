import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Virtuoso } from "react-virtuoso";
import { useVisibleGroupSelector } from "app/actions/profileGroup";
import { ProfileCardGroup } from "app/pages/home/content/ProfileCardGroup";
import { ProfileCardActionProvider } from "app/pages/home/content/ProfileCardActionProvider";
import { ProfileGroupActionProvider } from "app/pages/home/content/ProfileGroupActionProvider";
import { ProfileGroupListAction } from "app/pages/home/content/ProfileGroupListAction";

const TAB_LIST_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
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
  const groups = useVisibleGroupSelector();

  return (
    <Paper className={classes.profileGroupRoot} elevation={0}>
      <ProfileGroupListAction />
      <ProfileGroupActionProvider>
        <ProfileCardActionProvider>
          <div className={classes.profileGroupList}>
            <Virtuoso
              data={groups}
              overscan={1}
              // height of 1 row of ProfileCard
              defaultItemHeight={197}
              itemContent={(index, group) => {
                return (
                  <ProfileCardGroup
                    key={group.ID}
                    id={group.ID}
                    name={group.name}
                    profiles={group.profiles}
                  />
                );
              }}
            />
          </div>
        </ProfileCardActionProvider>
      </ProfileGroupActionProvider>
    </Paper>
  );
}

import { memo } from "react";
import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { Player } from "app/widgets/Player";
import { ContextMenu, ContextMenuItem } from "app/widgets/ContextMenu";
import {
  useDeleteProfileDispatcher,
  useProfileData,
  useRemoveProfileDispatcher,
  useSelectProfileDispatcher,
} from "app/actions/profileGroup";
import { DEFAULT_GROUP_NAME } from "app/constants";

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

export const ProfileCard = memo((props: ProfileCardProps) => {
  const { ID, profile, isSelected, groupID } = useProfileData(props.id);
  const classes = useStyles();
  const dispatchSelectProfile = useSelectProfileDispatcher();
  const deleteProfile = useDeleteProfileDispatcher();
  const removeProfile = useRemoveProfileDispatcher();

  if (!ID) {
    return null;
  }

  const contextMenu: ContextMenuItem[] = [
    {
      name: "Delete",
      onClick: () => deleteProfile(ID),
    },
  ];

  if (groupID !== DEFAULT_GROUP_NAME) {
    contextMenu.unshift({
      name: "Remove from group",
      onClick: () => removeProfile(ID),
    });
  }

  return (
    <ContextMenu menu={contextMenu}>
      <Card
        className={clsx({
          [classes.profileCard]: true,
          [classes.profileCardSelected]: isSelected,
        })}
        onClick={() => dispatchSelectProfile(ID)}
      >
        <div className={classes.player}>
          <Player profile={profile} aniFrameIndex={0} scale={3} />
        </div>
        <Typography className={classes.name} variant="body1">
          {profile.name}
        </Typography>
      </Card>
    </ContextMenu>
  );
});

type ProfileCardProps = {
  id: number;
};

import { memo, ReactNode, useMemo, useState } from "react";
import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import MoreVert from "@material-ui/icons/MoreVert";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Portrait } from "app/widgets/Player";
import {
  useProfileData,
  useSelectProfileDispatcher,
} from "app/actions/profile";
import { DragHandle } from "app/widgets/DragHandle";
import { animation } from "app/animation";
import { useDidUpdateEffect } from "app/helpers/hooks";
import { useProfileCardAction } from "app/pages/home/profileGroup/ProfileCardActionProvider";

export const PROFILE_CARD_WIDTH = 100;
export const PROFILE_CARD_HEIGHT = 130;

const useStyles = makeStyles((theme) => ({
  profileCard: {
    position: "relative",
    width: PROFILE_CARD_WIDTH,
    height: PROFILE_CARD_HEIGHT,
    transition: theme.transitions.create(["box-shadow", "background-color"]),

    "&:hover": {
      cursor: "pointer",
      boxShadow: theme.shadows[6],

      '& [aria-label="action"]': {
        opacity: 1,
      },
    },
  },
  profileCardSelected: {
    backgroundColor: theme.palette.primary[50],
    color: theme.palette.primary[800],
  },
  profileCardOnAir: {
    boxShadow:
      theme.shadows[6].replace(/rgba.*?\)/g, theme.palette.primary[100]) +
      " !important",
  },
  profileCardProjected: {
    opacity: 0.2,
  },
  action: {
    position: "absolute",
    top: 4,
    right: 2,
    zIndex: 1, // not sure why but without this the drag button does not work
    opacity: 0,
    transition: theme.transitions.create(["opacity", "color"]),
    color: theme.palette.grey[500],

    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  actionLeft: {
    right: "auto",
    left: 2,
  },
  name: {
    textAlign: "center",
    fontWeight: 500,
  },
  player: {
    marginTop: theme.spacing(1),
    marginBottom: 0,
    marginLeft: 28,
    marginRight: 0,
  },
}));

type DraggableProfileCardProps = {
  id: number;
};

export function DraggableProfileCard(props: DraggableProfileCardProps) {
  const { id } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useSortable({
    id: id.toString(),
    transition: animation.outOfTheWay,
  });
  const [isLanding, setIsLanding] = useState(false);
  const action = useMemo(
    () => (
      <DragHandle
        {...listeners}
        aria-label="move profile within this group"
        title="move profile within this group"
      />
    ),
    [listeners]
  );

  useDidUpdateEffect(() => {
    if (!isDragging) {
      setIsLanding(true);
      setTimeout(() => {
        setIsLanding(false);
      }, animation.dropping.duration);
    }
  }, [isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 1 : ("auto" as const),
    transition,
    outline: "none",
  };

  return (
    <div ref={setNodeRef} {...attributes} style={style}>
      <ProfileCard
        id={id}
        isProjecting={isDragging}
        isOnAir={isLanding}
        action={action}
      />
    </div>
  );
}

function useProfileCard(id: number) {
  const { ID, profile, isSelected, groupID } = useProfileData(id);
  const classes = useStyles();
  const { openContextMenu, openMoveMenu } = useProfileCardAction();
  const dispatchSelectProfile = useSelectProfileDispatcher();

  if (ID === undefined || ID === null) {
    return null;
  }

  return {
    classes,
    isSelected,
    dispatchSelectProfile,
    profile,
    groupID,
    openContextMenu,
    openMoveMenu,
  };
}

export const ProfileCard = memo((props: ProfileCardProps) => {
  const { id, action, isOnAir = false, isProjecting = false } = props;
  const result = useProfileCard(id);

  if (!result) {
    return null;
  }

  const {
    classes,
    isSelected,
    dispatchSelectProfile,
    profile,
    groupID,
    openContextMenu,
    openMoveMenu,
  } = result;

  return (
    <Card
      onContextMenu={(event) =>
        openContextMenu({ event, profileID: id, groupID })
      }
      className={clsx({
        [classes.profileCard]: true,
        [classes.profileCardSelected]: isSelected,
        [classes.profileCardOnAir]: isOnAir,
        [classes.profileCardProjected]: isProjecting,
      })}
      onClick={() => {
        dispatchSelectProfile(id);
      }}
    >
      {action && (
        <div aria-label="action" className={classes.action}>
          {action}
        </div>
      )}
      <div
        aria-label="action"
        className={clsx(classes.action, classes.actionLeft)}
      >
        <div
          role="button"
          aria-label="move profile between groups"
          title="move profile between groups"
          onClick={(event) => openMoveMenu({ event, profileID: id, groupID })}
        >
          <MoreVert />
        </div>
      </div>
      <div className={classes.player}>
        <Portrait profile={profile} scale={3} />
      </div>
      <Typography className={classes.name} variant="body1">
        {profile.name}
      </Typography>
    </Card>
  );
});
ProfileCard.displayName = "ProfileCard";

type ProfileCardProps = {
  id: number;
  action?: ReactNode;
  isOnAir?: boolean; // isOnAir effect = isDragging || isLanding
  isProjecting?: boolean;
};

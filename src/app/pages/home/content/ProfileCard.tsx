import { memo, ReactNode } from "react";
import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Player } from "app/widgets/Player";
import { ContextMenu, ContextMenuData } from "app/widgets/ContextMenu";
import {
  useDeleteProfileDispatcher,
  useGroupNamesSelector,
  useMoveProfileToGroupDispatcher,
  useProfileData,
  useRemoveProfileFromGroupDispatcher,
  useSelectProfileDispatcher,
} from "app/actions/profileGroup";
import { DEFAULT_GROUP_NAME } from "app/constants";
import { DragHandle } from "app/widgets/DragHandle";
import { animation } from "app/animation";

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
  profileCardDragged: {
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

export function DraggableProfileCard(props: ProfileCardProps) {
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
        action={<DragHandle {...listeners} />}
      />
    </div>
  );
}

function useProfileCard(id: number) {
  const { ID, profile, isSelected, groupID } = useProfileData(id);
  const classes = useStyles();

  const dispatchSelectProfile = useSelectProfileDispatcher();
  const deleteProfile = useDeleteProfileDispatcher();
  const removeProfileFromGroup = useRemoveProfileFromGroupDispatcher();
  const moveProfileToGroup = useMoveProfileToGroupDispatcher();
  const groupNames = useGroupNamesSelector();

  if (ID === undefined || ID === null) {
    return null;
  }

  const contextMenu: ContextMenuData[] = [
    {
      name: "Delete",
      onClick: () => deleteProfile(ID),
    },
  ];

  if (groupID !== DEFAULT_GROUP_NAME) {
    contextMenu.unshift({
      name: "Remove from group",
      onClick: () => removeProfileFromGroup(ID),
    });
  }

  contextMenu.unshift({
    name: "Move to group",
    children: groupNames
      .filter((g) => g !== groupID)
      .map((group) => ({
        name: group,
        onClick: () => moveProfileToGroup(ID, group),
      })),
  });

  return {
    classes,
    contextMenu,
    isSelected,
    dispatchSelectProfile,
    profile,
  };
}

export const ProfileCard = memo((props: ProfileCardProps) => {
  const { id, action, isDragging = false, isProjecting = false } = props;
  const result = useProfileCard(id);

  if (!result) {
    return null;
  }

  const {
    classes,
    contextMenu,
    isSelected,
    dispatchSelectProfile,
    profile,
  } = result;

  return (
    <ContextMenu menu={contextMenu}>
      <Card
        className={clsx({
          [classes.profileCard]: true,
          [classes.profileCardSelected]: isSelected,
          [classes.profileCardDragged]: isDragging,
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
  action?: ReactNode;
  isDragging?: boolean;
  isProjecting?: boolean;
};

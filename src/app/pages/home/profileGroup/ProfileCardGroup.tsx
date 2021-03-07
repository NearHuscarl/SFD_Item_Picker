import { useState } from "react";
import { IconButton, Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Delete from "@material-ui/icons/Delete";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import {
  ProfileCard,
  DraggableProfileCard,
} from "app/pages/home/profileGroup/ProfileCard";
import { DefaultGroup } from "app/constants";
import { useMoveProfileDispatcher } from "app/actions/profile";
import { DragHandle } from "app/widgets/DragHandle";
import { animation } from "app/animation";
import { GroupID } from "app/types";
import { useProfileGroupAction } from "app/pages/home/profileGroup/ProfileGroupActionProvider";

const TITLE_HEIGHT = 35;

const useStyles = makeStyles((theme) => ({
  header: {
    height: TITLE_HEIGHT,
    display: "flex",
    alignItems: "center",

    '& > [class*="MuiIconButton"]': {
      marginTop: -2,
    },
  },
  groupName: {
    marginRight: theme.spacing(1),
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

function useProfileCardGroup(id: GroupID) {
  const classes = useStyles();
  const moveProfile = useMoveProfileDispatcher();
  const { requestRenameGroup, requestDeleteGroup } = useProfileGroupAction();
  const [activeId, setActiveId] = useState<number | null>(null);
  const onClickTitle = (event) => {
    if (event.detail === 2 && id !== DefaultGroup.ID) {
      requestRenameGroup({ event, id });
    }
  };
  const onDragStart = (e) => {
    setActiveId(e.active.id);
  };
  const onDragEnd = (e) => {
    const { active, over } = e;

    if (over && active.id !== over.id) {
      moveProfile(Number(active.id), Number(over.id));
    }

    setActiveId(null);
  };

  return {
    classes,
    activeId,
    onDragStart,
    onDragEnd,
    requestDeleteGroup,
    onClickTitle,
  };
}

export function ProfileCardGroup(props: ProfileCardGroupProps) {
  const { id, name, profiles } = props;
  const {
    classes,
    activeId,
    onDragStart,
    onDragEnd,
    requestDeleteGroup,
    onClickTitle,
  } = useProfileCardGroup(id);

  let title = (
    <Typography
      onClick={onClickTitle}
      className={classes.groupName}
      variant="h6"
      component="h2"
    >
      {name}
    </Typography>
  );

  if (id === DefaultGroup.ID) {
    title = (
      <Tooltip
        title={`Profiles don't belong to any groups will be put in '${DefaultGroup.name}'`}
        arrow
      >
        {title}
      </Tooltip>
    );
  }

  return (
    <>
      <div className={classes.header}>
        {title}
        {id !== DefaultGroup.ID && (
          <IconButton
            size="small"
            onClick={() => requestDeleteGroup(id)}
            aria-label="delete this profile group"
            title="delete this profile group"
          >
            <Delete />
          </IconButton>
        )}
      </div>
      <div className={classes.groupContent}>
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetection={closestCenter}
        >
          <SortableContext items={profiles.map((p) => p.toString())}>
            {profiles.length > 0 &&
              profiles.map((id) => <DraggableProfileCard key={id} id={id} />)}
            {profiles.length === 0 && "There is no profile in this group"}
          </SortableContext>
          <DragOverlay dropAnimation={animation.dropping}>
            {activeId ? (
              <ProfileCard
                id={activeId}
                isOnAir
                // dummy dragger button for consistency
                action={<DragHandle />}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}

type ProfileCardGroupProps = {
  id: GroupID;
  name: string;
  profiles: number[];
};

import { useState } from "react";
import { Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import {
  ProfileCard,
  DraggableProfileCard,
} from "app/pages/home/content/ProfileCard";
import { DEFAULT_GROUP_NAME } from "app/constants";
import { useMoveProfileDispatcher } from "app/actions/profileGroup";
import { DragHandle } from "app/widgets/DragHandle";
import { animation } from "app/animation";

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

function useProfileCardGroup() {
  const classes = useStyles();
  const moveProfile = useMoveProfileDispatcher();
  const [activeId, setActiveId] = useState<number | null>(null);
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
  };
}

export function ProfileCardGroup(props: ProfileCardGroupProps) {
  const { name: groupName, profiles } = props;
  const { classes, activeId, onDragStart, onDragEnd } = useProfileCardGroup();

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
    <>
      {title}
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
                isDragging
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
  name: string;
  profiles: number[];
};

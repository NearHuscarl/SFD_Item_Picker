import { MenuItem, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { NewGroupButton } from "app/pages/home/profileGroup/NewGroupButton";
import {
  useAllGroupSelectSelector,
  useGroupSummariesSelector,
  useSetGroupVisibleDispatcher,
} from "app/actions/profile";
import { ALL_GROUP_ID } from "app/constants";

const useStyles = makeStyles((theme) => ({
  profileGroupAction: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),

    "& > :not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}));

export function ProfileGroupListAction() {
  const classes = useStyles();
  const isAllSelect = useAllGroupSelectSelector();
  const groupSummaries = useGroupSummariesSelector();
  const setGroupVisible = useSetGroupVisibleDispatcher();
  const handleChange = (event, child) => {
    const groupID = child.props.value;
    setGroupVisible(groupID);
  };
  const value = isAllSelect
    ? [ALL_GROUP_ID]
    : groupSummaries.filter((g) => g.isVisible).map((g) => g.ID);

  groupSummaries.unshift({ ID: ALL_GROUP_ID, name: "All", isVisible: false });

  return (
    <div className={classes.profileGroupAction}>
      <TextField
        style={{ width: 200 }}
        label="Groups"
        select
        SelectProps={{
          multiple: true,
          value,
          onChange: handleChange,
          MenuProps: {
            // dumb default make the menu jumping around when selecting
            // https://stackoverflow.com/a/59790471/9449426
            getContentAnchorEl: null,
          },
        }}
      >
        {groupSummaries.map(({ ID, name }) => (
          <MenuItem key={ID} value={ID}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <NewGroupButton />
    </div>
  );
}

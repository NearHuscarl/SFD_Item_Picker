import {
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
} from "@material-ui/core";
import { NewTemplateButton } from "app/pages/home/codeGen/NewTemplateButton";
import {
  useSelectedTemplate,
  useSelectTemplateDispatcher,
  useTemplateSummaries,
} from "app/actions/template";
import { makeStyles } from "@material-ui/styles";
import { useSetWrapLines, useWrapLinesSelector } from "app/actions/settings";
import { TemplateSettingsButton } from "app/pages/home/codeGen/TemplateSettingsButton";
import { CopyCodeButton } from "app/pages/home/codeGen/CopyCodeButton";

const useStyles = makeStyles((theme) => ({
  templateAction: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),

    "& > :not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  switch: {
    marginLeft: "auto",
  },
}));

export function TemplateAction() {
  const classes = useStyles();
  const templates = useTemplateSummaries();
  const value = useSelectedTemplate();
  const selectTemplate = useSelectTemplateDispatcher();
  const onChange = (event, child) => {
    const templateID = child.props.value;
    selectTemplate(templateID);
  };
  const wrapLines = useWrapLinesSelector();
  const setWrapLines = useSetWrapLines();
  const onChangeWrapLines = (e) => {
    const wrapLines = e.target.checked;
    setWrapLines(wrapLines);
  };

  return (
    <div className={classes.templateAction}>
      <TextField
        style={{ width: 200 }}
        label="Template"
        select
        SelectProps={{ value, onChange }}
      >
        {templates.map(({ ID, name }) => (
          <MenuItem key={ID} value={ID}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <NewTemplateButton />
      <TemplateSettingsButton />
      <FormControlLabel
        className={classes.switch}
        control={<Switch checked={wrapLines} onChange={onChangeWrapLines} />}
        label="Wrap lines"
      />
      <CopyCodeButton />
    </div>
  );
}

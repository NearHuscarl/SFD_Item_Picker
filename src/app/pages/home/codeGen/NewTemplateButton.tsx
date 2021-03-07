import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import { useForm } from "react-hook-form";
import {
  useAddTemplateDispatcher,
  useTemplateSummaries,
} from "app/actions/template";
import { makeStyles } from "@material-ui/styles";
import { DefaultTemplate } from "app/store/ducks/templates.duck.util";

const useStyle = makeStyles({
  templateInput: {
    "& textarea": {
      fontSize: 15,
      fontFamily:
        "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
    },
  },
});

export function NewTemplateButton() {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      name: "",
      template: DefaultTemplate.template,
    },
  });
  const [open, setOpen] = useState(false);
  const classes = useStyle();
  const addTemplate = useAddTemplateDispatcher();
  const templateSummaries = useTemplateSummaries();
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onSubmit = (data) => {
    addTemplate(data);
    onClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={onOpen}
      >
        New Template
      </Button>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogTitle>New Template</DialogTitle>
          <DialogContent>
            <TextField
              name="name"
              inputRef={register({
                required: "Name is a required field",
                validate: async (value) =>
                  templateSummaries.findIndex((t) => t.name === value) === -1 ||
                  `"${value}" has already been defined`,
              })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
            />
            <TextField
              name="template"
              spellCheck={false}
              className={classes.templateInput}
              inputRef={register({ required: "Template is a required field" })}
              error={Boolean(errors.template)}
              helperText={errors.template?.message}
              margin="dense"
              label="Template"
              multiline
              rows={20}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

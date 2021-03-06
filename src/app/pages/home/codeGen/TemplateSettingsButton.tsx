import { useReducer, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import Settings from "@material-ui/icons/Settings";
import Delete from "@material-ui/icons/Delete";
import {
  useDeleteTemplateDispatcher,
  useTemplateGetter,
} from "app/actions/template";
import { Template } from "app/types";

export function TemplateSettingsButton() {
  const getTemplates = useTemplateGetter();
  const deleteTemplate = useDeleteTemplateDispatcher();
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<Omit<Template, "template">[]>([]);
  const refreshTemplates = () => {
    setTemplates(getTemplates().filter((t) => !t.readonly));
  };
  const onOpen = () => {
    setOpen(true);
    refreshTemplates();
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button startIcon={<Settings />} variant="contained" onClick={onOpen}>
        Settings
      </Button>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Manage Template</DialogTitle>
        <DialogContent>
          <List>
            {templates.map((template) => (
              <ListItem key={template.ID}>
                <ListItemText primary={template.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      deleteTemplate(template.ID);
                      refreshTemplates();
                    }}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}

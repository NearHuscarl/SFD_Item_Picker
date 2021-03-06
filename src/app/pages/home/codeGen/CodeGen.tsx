import { makeStyles } from "@material-ui/core";
import { CodePreview } from "app/pages/home/codeGen/CodePreview";
import { TemplateAction } from "app/pages/home/codeGen/TemplateAction";

const useStyles = makeStyles((theme) => ({
  codeGenRoot: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
}));

export function CodeGen() {
  const classes = useStyles();

  return (
    <div className={classes.codeGenRoot}>
      <TemplateAction />
      <CodePreview />
    </div>
  );
}

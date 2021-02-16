import { makeStyles, TextField } from "@material-ui/core";
import { useTemplate } from "app/actions/template";

const useStyles = makeStyles((theme) => ({
  codeGen: {
    flex: "auto",
    alignSelf: "flex-end",
    fontFamily: "monospace",
  },
  codeGenInput: {
    height: "1000px !important",
    maxHeight: "calc(100vh - 120px - 18.5px * 2)", // TODO: fix 120px magic number
  },
}));

export function CodeGen(props) {
  const classes = useStyles();
  const [template, setTemplate] = useTemplate("IProfile");

  return (
    <TextField
      InputProps={{
        classes: {
          input: classes.codeGenInput,
        },
      }}
      className={classes.codeGen}
      value={template}
      onChange={(e) => setTemplate(e.target.value)}
      multiline
    />
  );
}

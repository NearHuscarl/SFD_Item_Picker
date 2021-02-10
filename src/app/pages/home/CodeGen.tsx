import { makeStyles, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { fillTemplate, getTemplate, TemplateName } from "app/helpers/template";
import { useSelector } from "app/store/reduxHooks";

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

function useTemplate(name: TemplateName) {
  const [template, _setTemplate] = useState("");
  const settings = useSelector((state) => state.profile.current);
  const setTemplate = (template) =>
    _setTemplate(fillTemplate(template, settings));

  useEffect(() => {
    getTemplate(name).then(setTemplate);
  }, [settings]);

  return [template, setTemplate] as const;
}

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

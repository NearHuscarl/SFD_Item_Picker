import { makeStyles } from "@material-ui/core";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import theme from "react-syntax-highlighter/dist/esm/styles/hljs/vs2015";
import { useTemplate } from "app/actions/template";

SyntaxHighlighter.registerLanguage("csharp", csharp);

const useStyles = makeStyles((theme) => ({
  codeGen: {
    marginBottom: theme.spacing(6),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: "calc(45px + 50px + 16px)",
    width: "100%",
  },
  codeWrapper: {
    height: "100%",

    "& > pre": {
      height: "100%",
      padding: `${theme.spacing(2)}px !important`,
      margin: 0,
    },
  },
}));

export function CodeGen() {
  const classes = useStyles();
  const [template, setTemplate] = useTemplate("IProfile");

  return (
    <div className={classes.codeGen}>
      <div className={classes.codeWrapper}>
        <SyntaxHighlighter language="csharp" style={theme}>
          {template}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

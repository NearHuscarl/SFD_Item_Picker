import { memo } from "react";
import { makeStyles } from "@material-ui/core";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import theme from "react-syntax-highlighter/dist/esm/styles/hljs/vs2015";
import { useCodeGen } from "app/actions/template";
import { useWrapLinesSelector } from "app/actions/settings";

SyntaxHighlighter.registerLanguage("csharp", csharp);

const useStyles = makeStyles((theme) => ({
  codeGen: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "auto",

    "& > pre": {
      height: "100%",
      padding: `${theme.spacing(2)}px !important`,
      margin: 0,
      borderRadius: theme.shape.borderRadius,
    },
    "& > pre::-webkit-scrollbar-track-piece": {
      backgroundColor: "rgb(30, 30, 30)",
    },
    "& > pre::-webkit-scrollbar-thumb:vertical": {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    "& > pre::-webkit-scrollbar-thumb:horizontal": {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
  },
}));

function useCodePreview() {
  const classes = useStyles();
  const code = useCodeGen();
  const wrapLines = useWrapLinesSelector();

  return { classes, wrapLines, code };
}

export const CodePreview = memo(() => {
  const { classes, wrapLines, code } = useCodePreview();

  return (
    <div className={classes.codeGen}>
      <SyntaxHighlighter
        language="csharp"
        style={theme}
        wrapLines={wrapLines}
        lineProps={
          wrapLines
            ? {
                style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
              }
            : undefined
        }
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

CodePreview.displayName = "CodePreview";

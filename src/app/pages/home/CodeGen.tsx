import { memo, useState } from "react";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import theme from "react-syntax-highlighter/dist/esm/styles/hljs/vs2015";
import { useTemplate } from "app/actions/template";
import { copy } from "app/helpers/copy";

SyntaxHighlighter.registerLanguage("csharp", csharp);

const useStyles = makeStyles((theme) => ({
  codeGen: {
    marginBottom: theme.spacing(6),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: "calc(45px + 50px + 16px)",
    width: "100%",
    position: "relative",
  },
  codeWrapper: {
    height: "100%",

    "& > pre": {
      height: "100%",
      padding: `${theme.spacing(2)}px !important`,
      margin: 0,
      borderRadius: theme.shape.borderRadius,
    },
  },
  action: {
    position: "absolute",
    top: 0,
    right: 0,

    '& [class*="MuiButtonBase"]': {
      color: theme.palette.primary[300],
    },
  },
}));

export const CodeGen = memo(() => {
  const classes = useStyles();
  const [code, setCode] = useTemplate();
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  const onCopy = () => {
    copy(code);
    setCopyTooltipOpen(true);
    setTimeout(() => {
      setCopyTooltipOpen(false);
    }, 2000);
  };

  return (
    <div className={classes.codeGen}>
      <div className={classes.action}>
        <Tooltip
          placement="top"
          title="Copied!"
          arrow
          open={copyTooltipOpen}
          // trigger onClick only
          onClose={() => setCopyTooltipOpen(false)}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          PopperProps={{
            disablePortal: true,
          }}
        >
          <IconButton
            color="primary"
            aria-label="copy"
            component="span"
            onClick={onCopy}
          >
            <FileCopy />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.codeWrapper}>
        <SyntaxHighlighter language="csharp" style={theme}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

CodeGen.displayName = "CodeGen";

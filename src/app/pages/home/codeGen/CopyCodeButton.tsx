import { IconButton, Tooltip } from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import { useState } from "react";
import { copy } from "app/helpers/copy";
import { useCodeGenGetter } from "app/actions/template";

export function CopyCodeButton() {
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  const getCodeGen = useCodeGenGetter();
  const onCopy = () => {
    copy(getCodeGen());
    setCopyTooltipOpen(true);
    setTimeout(() => {
      setCopyTooltipOpen(false);
    }, 2000);
  };

  return (
    <>
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
      >
        <IconButton
          color="primary"
          aria-label="copy code"
          title="copy code"
          component="span"
          onClick={onCopy}
        >
          <FileCopy />
        </IconButton>
      </Tooltip>
    </>
  );
}

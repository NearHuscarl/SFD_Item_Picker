import { IconButton, Tooltip } from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import { useState } from "react";
import { useCopyCodeGen } from "app/actions/template";

export function CopyCodeButton() {
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  const copyCodeGen = useCopyCodeGen();
  const onCopy = () => {
    copyCodeGen();
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

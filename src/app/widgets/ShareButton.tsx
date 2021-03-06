import { useEffect, useRef, useState } from "react";
import { IconButton, Popover, TextField, Typography } from "@material-ui/core";
import Share from "@material-ui/icons/Share";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { decodeProfile, encodeProfile } from "app/helpers/profile";
import { stringifyOneLineArray } from "app/helpers";
import { useDraftSelector } from "app/actions/editor";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    width: 445,
  },
  paperDebug: {
    opacity: "0.9 !important",
  },
  text: {
    marginBottom: theme.spacing(1),
  },
}));

function useShareButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const profile = useDraftSelector();
  const devTool = useSelector((state) => state.global.devTool);
  const classes = useStyles();
  const urlParams = encodeProfile(profile);
  const open = Boolean(anchorEl);
  const onClose = () => {
    setAnchorEl(null);
  };
  const onShare = (e) => {
    setAnchorEl(e.currentTarget);
  };

  useEffect(() => {
    if (open) {
      // just open the popover. The TextField inside it does not exist yet
      setTimeout(() => {
        inputRef.current?.select();
      });
    }
  }, [open]);

  return {
    classes,
    devTool,
    anchorEl,
    inputRef,
    onShare,
    onClose,
    open,
    urlParams,
    decodedTextForDebugging: devTool
      ? stringifyOneLineArray(decodeProfile(urlParams))
      : "",
  };
}

export function ShareButton() {
  const {
    classes,
    devTool,
    anchorEl,
    inputRef,
    open,
    onShare,
    onClose,
    urlParams,
    decodedTextForDebugging,
  } = useShareButton();

  return (
    <>
      <IconButton
        color="primary"
        title="share"
        aria-label="share"
        onClick={onShare}
      >
        <Share />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        classes={{
          paper: devTool
            ? classes.paper + " " + classes.paperDebug
            : classes.paper,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: -8,
          horizontal: "left",
        }}
      >
        <Typography className={classes.text}>
          Share a link to your profile
        </Typography>
        <TextField
          inputRef={inputRef}
          InputProps={{ readOnly: true }}
          fullWidth
          value={window.location.host + "?p=" + urlParams}
        />
        {decodedTextForDebugging && (
          <TextField
            fullWidth
            multiline
            rows={21}
            value={decodedTextForDebugging}
          />
        )}
      </Popover>
    </>
  );
}

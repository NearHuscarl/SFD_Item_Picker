import { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Popover,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import Share from "@material-ui/icons/Share";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "app/store/reduxHooks";
import { decodeProfile, encodeProfile } from "app/helpers/profile";
import { stringifyOneLineArray } from "app/helpers";

const useStyles = makeStyles<Theme>((theme) => ({
  paper: {
    padding: theme.spacing(2),
    width: 460,
  },
  text: {
    marginBottom: theme.spacing(1),
  },
}));

function useShareButton() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const profileSettings = useSelector((state) => state.profile.current);
  const devTool = useSelector((state) => state.global.devTool);
  const urlParams = encodeProfile(profileSettings);
  const open = Boolean(anchorEl);
  const onOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };
  const onShare = (e) => {
    onOpen(e);
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
          paper: classes.paper,
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
          value={window.location.host + "/?p=" + urlParams}
        />
        {decodedTextForDebugging && (
          <TextField
            fullWidth
            multiline
            rows={30}
            value={decodedTextForDebugging}
          />
        )}
      </Popover>
    </>
  );
}

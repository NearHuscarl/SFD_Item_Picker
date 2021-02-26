import { forwardRef, ReactNode } from "react";
import { emphasize, Theme, Typography } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import { makeStyles } from "@material-ui/styles";
import { SnackbarKey } from "notistack";
import { useSelector } from "react-redux";

const useStyles = makeStyles<Theme, { progress: number }>((theme) => {
  // @ts-ignore
  const mode = theme.palette.mode || theme.palette.type;
  const backgroundColor = emphasize(
    theme.palette.background.default,
    mode === "light" ? 0.8 : 0.98
  );

  return {
    root: {
      [theme.breakpoints.up("sm")]: {
        minWidth: 315,
      },

      // contentRoot
      // https://github.com/iamhosseindhv/notistack/blob/e5e2fb0b95bb686e42678eeec6e0be6e3c40a676/src/SnackbarItem/SnackbarItem.tsx#L39
      ...theme.typography.body2,
      color: theme.palette.getContrastText(backgroundColor),
      alignItems: "center",
      borderRadius: "4px",
      boxShadow:
        "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    },
    title: {
      backgroundColor,
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      display: "flex",
      alignItems: "center",
      padding: "14px 16px",
    },
    content: {
      padding: "12px 16px",
      borderRadius: "4px",
      position: "relative",
      backgroundColor: "white",
      zIndex: 0,

      "&:before": {
        content: '""',
        display: "block",
        position: "absolute",
        left: 0,
        top: 0,
        width: ({ progress }) => `${progress}%`,
        height: "100%",
        backgroundColor: teal[50],
        zIndex: -1,
      },
    },
  };
});

export const ProgressSnackbar = forwardRef<
  HTMLDivElement,
  ProgressSnackbarProps
>(({ id, title }, ref) => {
  const { progress, message } = useSelector(
    (state) => state.global.indexedDBProgress
  );
  const classes = useStyles({ progress });

  return (
    <div ref={ref} className={classes.root}>
      <div className={classes.title}>
        {title} {progress ? `(${progress}%)` : ""}
      </div>
      <div className={classes.content}>
        <Typography variant="body2" color="textSecondary" component="p">
          {message}
        </Typography>
      </div>
    </div>
  );
});

ProgressSnackbar.displayName = "ProgressSnackbar";

type ProgressSnackbarProps = {
  id: SnackbarKey;
  title: ReactNode;
};

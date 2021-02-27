import { makeStyles, Tab } from "@material-ui/core";
import { TabContext, TabList } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { CodeGen } from "app/pages/home/content/CodeGen";
import { ProfileGroupList } from "app/pages/home/content/ProfileGroupList";
import { globalActions } from "app/store/rootDuck";

const TAB_LIST_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
  content: {
    height: "100%",
    padding: theme.spacing(2),
  },
  tabsIndicator: {
    backgroundColor: "transparent",
  },
  tabsRoot: {
    '& [role="tablist"]': {
      height: TAB_LIST_HEIGHT,
    },
  },
  tab: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightBold,
    "&:hover": {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: theme.palette.primary[400],
    },
    "&:focus": {
      color: theme.palette.primary.main,
    },
  },
  tabPanel: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#ffffff",
    height: `calc(100% - ${TAB_LIST_HEIGHT}px)`,
  },
  tabPanelContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
}));

export function Content(props) {
  const classes = useStyles();
  const currentTab = useSelector((state) => state.global.currentTab);
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    dispatch(globalActions.setCurrentTab(newValue));
  };

  return (
    <div className={classes.content}>
      <TabContext value={currentTab}>
        <TabList
          onChange={handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab className={classes.tab} value="1" label="Code Gen" />
          <Tab className={classes.tab} value="2" label="Profile Group" />
        </TabList>
        <div className={classes.tabPanel}>
          <div
            className={classes.tabPanelContent}
            style={{
              visibility: currentTab === "1" ? "visible" : "hidden",
            }}
          >
            <CodeGen />
          </div>
          <div
            className={classes.tabPanelContent}
            style={{
              visibility: currentTab === "2" ? "visible" : "hidden",
            }}
          >
            <ProfileGroupList />
          </div>
        </div>
      </TabContext>
    </div>
  );
}

import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { profileActions } from "app/store/rootDuck";

export function ClearAllButton({ className }: { className?: string }) {
  const dispatch = useDispatch();
  const onClearAll = () => {
    dispatch(profileActions.setAllItems());
  };

  return (
    <Button
      className={className}
      variant="outlined"
      size="small"
      onClick={onClearAll}
    >
      Clear All
    </Button>
  );
}

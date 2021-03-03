import DragIndicator from "@material-ui/icons/DragIndicator";

export function DragHandle(props) {
  return (
    <div {...props} style={{ cursor: "move" }}>
      <DragIndicator />
    </div>
  );
}

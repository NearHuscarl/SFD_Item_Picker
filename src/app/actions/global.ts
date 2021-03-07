import { useStore } from "react-redux";

export function useGetCurrentTab() {
  const store = useStore();

  return () => {
    const { currentTab } = store.getState().global;

    switch (currentTab) {
      case "1":
        return "codeGen";
      case "2":
        return "profileGroup";
      default:
        throw new Error("not exist");
    }
  };
}

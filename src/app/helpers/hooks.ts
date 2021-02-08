import { useEffect } from "react";

export function useOnMount(cb: Function) {
  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

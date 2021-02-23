import { unstable_trace } from "scheduler/tracing";

// https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16#tracing-state-updates
export function trace(message: string, cb: Function) {
  unstable_trace(message, performance.now(), cb);
}

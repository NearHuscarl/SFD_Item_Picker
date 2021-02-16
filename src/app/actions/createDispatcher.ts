import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export function createDispatcher<Payload extends any>(
  actionCreator: ActionCreatorWithPayload<Payload>
) {
  return function () {
    const dispatch = useDispatch();
    return (params: Payload) => dispatch(actionCreator(params));
  };
}

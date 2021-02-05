import { createSelectorHook, createStoreHook, useDispatch } from "react-redux";
import { RootState } from "app/store/store";
import { ActionCreatorWithPayload, PayloadAction } from "@reduxjs/toolkit";

export const useSelector = createSelectorHook<RootState>();
export const useStore = createStoreHook<RootState>();

export function useRedux<Selected extends unknown, Payload extends any>(
  selector: (state: RootState) => Selected,
  actionCreator: ActionCreatorWithPayload<Payload>
) {
  const selected = useSelector(selector);
  const dispatch = useDispatch();

  return [
    selected,
    (value: Payload) => dispatch<PayloadAction<Payload>>(actionCreator(value)),
  ] as const;
}

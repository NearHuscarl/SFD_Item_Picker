import { AsyncThunk, AsyncThunkPayloadCreator } from "@reduxjs/toolkit";
import { RootState } from "app/store/store";
import { Dispatch } from "redux";

declare module "@reduxjs/toolkit" {
  type AsyncThunkConfig = {
    state?: RootState;
    dispatch?: Dispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
  };

  function createAsyncThunk<
    Returned,
    ThunkArg = void,
    ThunkApiConfig extends AsyncThunkConfig = { state: RootState }
  >(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<
      Returned,
      ThunkArg,
      ThunkApiConfig
    >,
    options?: any
  ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;
}

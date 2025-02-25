import { configureStore } from "@reduxjs/toolkit";
import thunk, { ThunkDispatch } from "redux-thunk";
import { ReducersCollection } from "./reducer.collection";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

export const store = configureStore({
  reducer: ReducersCollection,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type StateInterface = ReturnType<typeof store.getState>;

export interface Action<T = string> {
  type: string;
  payload: Partial<T>;
}

export type Dispatch<A> = ThunkDispatch<
  StateInterface,
  Record<string, unknown>,
  Action<A>
>;

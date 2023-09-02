import { configureStore } from "@reduxjs/toolkit";
import workspaceSlice from "features/workspaceSlice/workspaceSlice";

export const store = configureStore({
  reducer: {
    workspace: workspaceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

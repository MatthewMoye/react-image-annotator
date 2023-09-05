import { configureStore } from "@reduxjs/toolkit";
import imageSlice from "features/imageSlice/imageSlice";
import regionSlice from "features/regionSlice/regionSlice";
import toolSlice from "features/toolSlice/toolSlice";

export const store = configureStore({
  reducer: {
    image: imageSlice,
    region: regionSlice,
    tool: toolSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

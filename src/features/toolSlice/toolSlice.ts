import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toolIconList } from "components/Toolbar/Toolbar";
import { Image } from "types/image";

interface ImageState {
  activeImageIdx: number;
  activeTool: keyof typeof toolIconList;
  images: Image[];
  isPanning: boolean;
  isMovingImg: boolean;
  totalImageSize: { width: number; height: number };
  zoomLvl: number;
}

const initialState: ImageState = {
  activeImageIdx: 0,
  activeTool: "select",
  images: [],
  isPanning: false,
  isMovingImg: false,
  totalImageSize: { width: 0, height: 0 },
  zoomLvl: 1,
};

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setIsMovingImg: (state, action: PayloadAction<boolean>) => {
      state.isMovingImg = action.payload;
    },
    setIsPanning: (state, action: PayloadAction<boolean>) => {
      state.isPanning = action.payload;
    },
    setTool: (state, action: PayloadAction<keyof typeof toolIconList>) => {
      state.activeTool = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoomLvl = action.payload;
    },
    zoom: (state, action: PayloadAction<number>) => {
      const zoomAdd =
        action.payload * (state.zoomLvl < 2 ? 0.1 : 0.1 * state.zoomLvl);
      state.zoomLvl = Math.max(Math.min(state.zoomLvl + zoomAdd, 30), 0.1);
    },
  },
});

export const { setIsMovingImg, setIsPanning, setTool, setZoom, zoom } =
  imageSlice.actions;

export default imageSlice.reducer;

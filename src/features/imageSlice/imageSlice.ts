import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Image, UploadedImage } from "types/image";

interface ImageState {
  activeImageIdx: number;
  images: Image[];
  totalImageSize: { width: number; height: number };
}

const initialState: ImageState = {
  activeImageIdx: 0,
  images: [],
  totalImageSize: { width: 0, height: 0 },
};

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImageList: (state, action: PayloadAction<UploadedImage[]>) => {
      state.images = action.payload.map((img) => ({
        ...img,
        angle: 0,
        width: 0,
        height: 0,
      }));
    },
    loadImage: {
      reducer: (
        state,
        action: PayloadAction<{
          idx: number;
          width: number;
          height: number;
        }>
      ) => {
        const { idx, width, height } = action.payload;
        state.images[idx] = { ...state.images[idx], width, height };
        state.totalImageSize.width += width;
        state.totalImageSize.height += height;
      },
      prepare: (idx: number, width: number, height: number) => {
        return { payload: { idx, width, height } };
      },
    },
    setActiveImageIdx: (state, action: PayloadAction<number>) => {
      state.activeImageIdx = action.payload;
    },
    rotateImage: (state) => {
      state.images[state.activeImageIdx].angle += 30;
      state.images[state.activeImageIdx].angle %= 360;
    },
  },
});

export const { setImageList, loadImage, setActiveImageIdx, rotateImage } =
  imageSlice.actions;

export default imageSlice.reducer;

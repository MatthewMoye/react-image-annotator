import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toolIconList } from "components/Toolbar/Toolbar";
import { Image } from "types/image";

interface Mode {
  operation: string;
}

interface WorkspaceState {
  activeImageIdx: number;
  activeRegionId: string;
  activeRegionType: string;
  activeTool: keyof typeof toolIconList;
  images: Image[];
  isPanning: boolean;
  isMovingImg: boolean;
  mode: Mode;
  totalImageSize: { width: number; height: number };
  workspaceLoaded: boolean;
  zoomLvl: number;
}

const initialState: WorkspaceState = {
  activeImageIdx: 0,
  activeRegionId: "",
  activeRegionType: "",
  activeTool: "select",
  images: [],
  isPanning: false,
  isMovingImg: false,
  mode: { operation: "" },
  totalImageSize: { width: 0, height: 0 },
  workspaceLoaded: false,
  zoomLvl: 1,
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    // Regions
    selectRegion: {
      reducer: (
        state,
        action: PayloadAction<{ regionId: string; regionType: string }>
      ) => {
        const { regionId, regionType } = action.payload;
        state.activeRegionId = regionId;
        state.activeRegionType = regionType;
      },
      prepare: (regionId: string, regionType: string) => {
        return { payload: { regionId, regionType } };
      },
    },
    // Image
    setActiveImgIdx: (state, action: PayloadAction<number>) => {
      state.activeImageIdx = action.payload;
    },
    setIsMovingImg: (state, action: PayloadAction<boolean>) => {
      state.isMovingImg = action.payload;
    },
    // Tools
    setIsPanning: (state, action: PayloadAction<boolean>) => {
      state.isPanning = action.payload;
    },
    setTool: (state, action: PayloadAction<keyof typeof toolIconList>) => {
      state.activeTool = action.payload;
    },
    setWorkspaceLoaded: (state, action: PayloadAction<boolean>) => {
      state.workspaceLoaded = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoomLvl = action.payload;
    },
    zoom: (state, action: PayloadAction<number>) => {
      const zoomAdd =
        action.payload * (state.zoomLvl < 2 ? 0.1 : 0.1 * state.zoomLvl);
      state.zoomLvl = Math.max(Math.min(state.zoomLvl + zoomAdd, 20), 0.5);
    },
  },
});

export const {
  // Regions
  selectRegion,
  // Image
  setActiveImgIdx,
  setIsMovingImg,
  // Tools
  setIsPanning,
  setTool,
  setWorkspaceLoaded,
  setZoom,
  zoom,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

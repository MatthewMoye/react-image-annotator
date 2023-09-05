import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Region } from "types/region";

interface Mode {
  operation: string;
  activePoint: number;
}

const defaultMode: Mode = {
  operation: "",
  activePoint: 0,
};

interface RegionState {
  activeRegionId: string;
  activeRegionType: string;
  mode: Mode;
  regions: Region[];
}

const initialState: RegionState = {
  activeRegionId: "",
  activeRegionType: "",
  mode: defaultMode,
  regions: [],
};

const getActiveRegion = (state: RegionState) => {
  // eslint-disable-next-line
  return state.regions.find((r) => r.id === state.activeRegionId)!;
};

export const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    selectRegion: {
      reducer: (
        state,
        action: PayloadAction<{ regionId: string; regionType: string }>
      ) => {
        const { regionId, regionType } = action.payload;
        state.activeRegionId = regionId;
        state.activeRegionType = regionType.toUpperCase();
      },
      prepare: (regionId: string, regionType: string) => {
        return { payload: { regionId, regionType } };
      },
    },
    // Point
    createPoint: {
      reducer: (
        state,
        action: PayloadAction<{ x: number; y: number; imageId: string }>
      ) => {
        const { x, y, imageId } = action.payload;
        const newRegion = {
          id: `point-${state.regions.filter((r) => r.type === "point").length}`,
          imageId,
          type: "point",
          angle: 0,
          points: [[x, y]],
        };
        state.regions.push(newRegion);
        state.activeRegionId = newRegion.id;
        state.activeRegionType = "POINT";
      },
      prepare: (x: number, y: number, imageId: string) => {
        return { payload: { x, y, imageId } };
      },
    },
    startPointMove: (state) => {
      state.mode.operation = "MOVE_POINT";
    },
    movePoint: {
      reducer: (state, action: PayloadAction<{ x: number; y: number }>) => {
        const { x, y } = action.payload;
        const region = getActiveRegion(state);
        region.points = [[x, y]];
      },
      prepare: (x: number, y: number) => {
        return { payload: { x, y } };
      },
    },
    stopPointMove: (state) => {
      state.mode = defaultMode;
    },
    // Box
    startCreateBox: {
      reducer: (
        state,
        action: PayloadAction<{ x: number; y: number; imageId: string }>
      ) => {
        const { x, y, imageId } = action.payload;
        const newRegion = {
          id: `box-${state.regions.filter((r) => r.type === "box").length}`,
          imageId,
          type: "box",
          angle: 0,
          points: [
            [x, y],
            [x, y],
            [x, y],
            [x, y],
          ],
        };
        state.regions.push(newRegion);
        state.activeRegionId = newRegion.id;
        state.activeRegionType = "BOX";
        state.mode.operation = "CREATE_BOX";
      },
      prepare: (x: number, y: number, imageId: string) => {
        return { payload: { x, y, imageId } };
      },
    },
    mouseMoveCreateBox: {
      reducer: (state, action: PayloadAction<{ x: number; y: number }>) => {
        const { x, y } = action.payload;
        const region = getActiveRegion(state);
        const points = region.points;
        region.points = [
          [...points[0]],
          [x, points[0][1]],
          [x, y],
          [points[0][0], y],
        ];
      },
      prepare: (x: number, y: number) => {
        return { payload: { x, y } };
      },
    },
    stopCreateBox: (state) => {
      const points = getActiveRegion(state).points;
      if (
        Math.abs(points[0][0] - points[2][0]) < 0.001 &&
        Math.abs(points[0][1] - points[2][1]) < 0.001
      ) {
        state.regions = state.regions.filter(
          (r) => r.id !== state.activeRegionId
        );
      }
      state.mode = defaultMode;
    },
    startBoxTransform: (state, action: PayloadAction<number>) => {
      state.mode.operation = "BOX_TRANSFORM";
      state.mode.activePoint = action.payload;
    },
    mouseMoveBoxTransform: {
      reducer: (state, action: PayloadAction<{ x: number; y: number }>) => {
        const { x, y } = action.payload;
        const region = getActiveRegion(state);
        const points = region.points;
        const activeIdx = state.mode.activePoint;
        if (activeIdx < 4) {
          region.points = points.map((p, idx) => {
            if (idx === activeIdx) {
              return [x, y];
            } else if (idx !== (activeIdx + 2) % 4) {
              const xCheck = points[activeIdx][0] === p[0];
              return [xCheck ? x : p[0], !xCheck ? y : p[1]];
            } else {
              return p;
            }
          });
        } else if (activeIdx < 8) {
          region.points = points.map((p, idx) => {
            const xCheck =
              points[activeIdx % 4][0] === points[(activeIdx + 1) % 4][0];
            if (idx === activeIdx % 4 || idx === (activeIdx + 1) % 4) {
              return [xCheck ? x : p[0], !xCheck ? y : p[1]];
            } else {
              return p;
            }
          });
        } else {
          const updateX = x - (points[0][0] + points[2][0]) / 2;
          const updateY = y - (points[0][1] + points[2][1]) / 2;
          region.points = points.map((p) => [p[0] + updateX, p[1] + updateY]);
        }
      },
      prepare: (x: number, y: number) => {
        return { payload: { x, y } };
      },
    },
    stopBoxTransform: (state) => {
      state.mode = defaultMode;
    },
  },
});

export const {
  // Shared
  selectRegion,
  // Point
  createPoint,
  startPointMove,
  movePoint,
  stopPointMove,
  // Box
  startCreateBox,
  mouseMoveCreateBox,
  stopCreateBox,
  startBoxTransform,
  mouseMoveBoxTransform,
  stopBoxTransform,
} = regionSlice.actions;

export default regionSlice.reducer;

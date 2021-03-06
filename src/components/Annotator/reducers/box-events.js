import { getIn, merge, set, setIn } from "seamless-immutable";

const boxEvents = (state, action) => {
  const activeImgPath = ["images", state.activeImageIdx];
  const regions = getIn(state, [...activeImgPath, "regions"]);
  const activeRegionIdx = regions.findIndex(
    (r) => r.id === state.activeRegionId
  );

  switch (action.event) {
    case "START_TRANSFORM": {
      return set(state, "mode", { mode: "BOX_TRANSFORM", point: action.point });
    }
    case "MOUSE_MOVE": {
      const points = [...regions[activeRegionIdx]?.points];
      if (state.mode?.mode === "BOX_TRANSFORM") {
        const activeIdx = state.mode.point;
        if (activeIdx < 4) {
          return setIn(
            state,
            [...activeImgPath, "regions", activeRegionIdx, "points"],
            points.map((p, idx) => {
              if (idx === activeIdx) {
                return [action.x, action.y];
              } else if (idx !== (activeIdx + 2) % 4) {
                const xCheck = points[activeIdx][0] === p[0];
                return [xCheck ? action.x : p[0], !xCheck ? action.y : p[1]];
              } else {
                return p;
              }
            })
          );
        } else if (activeIdx < 8) {
          return setIn(
            state,
            [...activeImgPath, "regions", activeRegionIdx, "points"],
            points.map((p, idx) => {
              const xCheck =
                points[activeIdx % 4][0] === points[(activeIdx + 1) % 4][0];
              if (idx === activeIdx % 4 || idx === (activeIdx + 1) % 4) {
                return [xCheck ? action.x : p[0], !xCheck ? action.y : p[1]];
              } else {
                return p;
              }
            })
          );
        } else {
          const updateX = action.x - (points[0][0] + points[2][0]) / 2;
          const updateY = action.y - (points[0][1] + points[2][1]) / 2;
          return setIn(
            state,
            [...activeImgPath, "regions", activeRegionIdx, "points"],
            points.map((p) => [p[0] + updateX, p[1] + updateY])
          );
        }
      } else if (state.mode?.mode === "CREATE_BOX") {
        return setIn(
          state,
          [...activeImgPath, "regions", activeRegionIdx, "points"],
          [
            [...points[0]],
            [action.x, points[0][1]],
            [action.x, action.y],
            [points[0][0], action.y],
          ]
        );
      }
      return state;
    }
    case "MOUSE_DOWN": {
      const newRegion = {
        id: `box-${regions.filter((r) => r.type === "box").length}`,
        type: "box",
        points: [
          [action.x, action.y],
          [action.x, action.y],
          [action.x, action.y],
          [action.x, action.y],
        ],
      };
      state = set(state, "mode", { mode: "CREATE_BOX" });
      return merge(
        setIn(state, [...activeImgPath, "regions", regions.length], newRegion),
        {
          activeRegionId: newRegion.id,
          activeRegionType: newRegion.type,
        }
      );
    }
    case "MOUSE_UP": {
      if (state.mode?.mode === "CREATE_BOX") {
        const points = regions[activeRegionIdx].points;
        if (
          Math.abs(points[0][0] - points[2][0]) < 0.001 &&
          Math.abs(points[0][1] - points[2][1]) < 0.001
        ) {
          state = setIn(
            state,
            [...activeImgPath, "regions"],
            regions.filter((r, idx) => idx !== activeRegionIdx)
          );
        }
      }
      return set(state, "mode", {});
    }
    default: {
      return state;
    }
  }
};

export default boxEvents;

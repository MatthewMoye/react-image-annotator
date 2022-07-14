import { getIn, merge, set, setIn } from "seamless-immutable";

const pointEvents = (state, action) => {
  const activeImgPath = ["images", state.activeImageIdx];
  const regions = getIn(state, [...activeImgPath, "regions"]);
  const activeRegionIdx = regions.findIndex(
    (r) => r.id === state.activeRegionId
  );

  switch (action.event) {
    case "MOUSE_MOVE": {
      if (state.mode?.mode === "MOVE_POINT") {
        return setIn(
          state,
          [...activeImgPath, "regions", activeRegionIdx, "points"],
          [[action.x, action.y]]
        );
      }
      return state;
    }
    case "MOUSE_DOWN": {
      if (action.operation === "START_MOVE") {
        return set(state, "mode", { mode: "MOVE_POINT" });
      }
      const newRegion = {
        id: `point-${regions.filter((r) => r.type === "point").length}`,
        type: "point",
        points: [[action.x, action.y]],
      };
      return merge(
        setIn(state, [...activeImgPath, "regions", regions.length], newRegion),
        {
          activeRegionId: newRegion.id,
          activeRegionType: newRegion.type,
        }
      );
    }
    case "MOUSE_UP": {
      if (action.operation === "STOP_MOVE") {
        return set(state, "mode", {});
      }
      return state;
    }
    default: {
      return state;
    }
  }
};

export default pointEvents;

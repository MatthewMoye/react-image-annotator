import { merge, set } from "seamless-immutable";
import boxEvents from "./box-events";
import imageEvents from "./image-events";
import pointEvents from "./point-events";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TOOL": {
      return set(state, "activeTool", action.tool);
    }
    case "SELECT_REGION": {
      return merge(state, {
        activeRegionId: action.regionId,
        activeRegionType: action.regionType,
      });
    }
    case "UNSELECT": {
      return merge(state, { activeRegionId: null, activeRegionType: null });
    }
    case "PAN": {
      return set(state, "isPanning", action.toggle);
    }
    case "ZOOM": {
      const zoom = state.zoomLvl;
      const zoomAdd = action.direction * (zoom < 2 ? 0.1 : 0.1 * zoom);
      return set(state, "zoomLvl", Math.max(Math.min(zoom + zoomAdd, 20), 0.5));
    }
    case "DEFAULT_ZOOM": {
      state = set(state, "workspaceLoaded", true);
      return set(state, "zoomLvl", action.zoomLvl);
    }
    case "BOX": {
      return boxEvents(state, action);
    }
    case "POINT": {
      return pointEvents(state, action);
    }
    case "IMAGE": {
      return imageEvents(state, action);
    }
    case "STOP_ALL_ACTIONS": {
      return merge(state, { isPanning: false, isMovingImg: false });
    }
    default: {
      return state;
    }
  }
};

export default reducer;

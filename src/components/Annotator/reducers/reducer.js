import imageEvents from "./image-events";
import pointEvents from "./point-events";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TOOL": {
      return { ...state, activeTool: action.tool };
    }
    case "SELECT_REGION": {
      return { ...state, activeRegionId: action.regionId };
    }
    case "UNSELECT": {
      return { ...state, activeRegionId: null };
    }
    case "PAN": {
      return { ...state, isPanning: action.toggle };
    }
    case "ZOOM": {
      const zoomPercent =
        action.direction * (state.zoomLvl < 2 ? 0.1 : 0.1 * state.zoomLvl);
      return {
        ...state,
        zoomLvl: Math.max(Math.min(state.zoomLvl + zoomPercent, 20), 0.5),
      };
    }
    case "BOX": {
      return state;
    }
    case "POINT": {
      return pointEvents(state, action);
    }
    case "IMAGE": {
      return imageEvents(state, action);
    }
    case "STOP_ALL_ACTIONS": {
      return { ...state, isPanning: false, isMovingImg: false };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

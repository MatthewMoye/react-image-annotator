import { merge } from "seamless-immutable";
import boxEvents from "./box-events";
import imageEvents from "./image-events";
import pointEvents from "./point-events";

const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT_REGION": {
      return merge(state, {
        activeRegionId: action.regionId,
        activeRegionType: action.regionType,
      });
    }
    case "UNSELECT": {
      return merge(state, { activeRegionId: null, activeRegionType: null });
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
    default: {
      return state;
    }
  }
};

export default reducer;

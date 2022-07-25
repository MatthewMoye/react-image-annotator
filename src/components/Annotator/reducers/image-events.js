import { getIn, merge, set, setIn } from "seamless-immutable";

const imageEvents = (state, action) => {
  const activeImgPath = ["images", state.activeImageIdx];

  switch (action.event) {
    case "MOVE": {
      return set(state, "isMovingImg", action.toggle);
    }
    case "ROTATE": {
      const angle = getIn(state, [...activeImgPath, "angle"], 0);
      return setIn(state, [...activeImgPath, "angle"], (angle + 30) % 360);
    }
    case "LOAD": {
      const imgPath = ["images", action.idx];
      const image = merge(getIn(state, imgPath), {
        angle: 0,
        width: action.w,
        height: action.h,
        regions: action.regions ? action.regions : [],
      });
      state = merge(state, {
        totalImageSize: {
          width: state.totalImageSize.width + action.w,
          height: state.totalImageSize.height + action.h,
        },
      });
      return setIn(state, imgPath, image);
    }
    case "SET_ACTIVE": {
      return merge(state, { activeTool: "select", activeImageIdx: action.idx });
    }
    default: {
      return state;
    }
  }
};

export default imageEvents;

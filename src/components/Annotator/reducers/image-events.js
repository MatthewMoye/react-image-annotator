const imageEvents = (state, action) => {
  switch (action.event) {
    case "MOVE": {
      return { ...state, isMovingImg: action.toggle };
    }
    case "ROTATE": {
      let images = [...state.images];
      images[state.activeImageIdx].angle =
        (images[state.activeImageIdx].angle + 30) % 360;
      return { ...state, images: images };
    }
    case "LOAD": {
      let images = [...state.images];
      images[action.idx] = {
        ...images[action.idx],
        angle: 0,
        width: action.w,
        height: action.h,
        regions: action.regions ? action.regions : [],
      };
      return { ...state, images: images };
    }
    case "SET_ACTIVE": {
      return { ...state, activeTool: "select", activeImageIdx: action.idx };
    }
    default: {
      return state;
    }
  }
};

export default imageEvents;

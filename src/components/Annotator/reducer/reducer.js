const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TOOL": {
      return { ...state, activeTool: action.tool };
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
      return state;
    }
    case "ROTATE_IMAGE": {
      return {
        ...state,
        images: state.images.map((img, imgIdx) => {
          return imgIdx === state.activeImageIdx
            ? { ...img, angle: ((img.angle ? img.angle : 0) + 90) % 360 }
            : img;
        }),
      };
    }
    case "LOAD_IMAGE": {
      return {
        ...state,
        images: state.images.map((img) =>
          img.id !== action.id
            ? img
            : { ...img, width: action.w, height: action.h }
        ),
      };
    }
    case "SET_ACTIVE_IMAGE": {
      return { ...state, activeTool: "select", activeImageIdx: action.idx };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

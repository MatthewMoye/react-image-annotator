const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TOOL": {
      return { ...state, activeTool: action.tool };
    }
    case "ZOOM": {
      const zoomPercent =
        action.direction * (state.zoomLvl < 1.5 ? 0.05 : 0.05 * state.zoomLvl);
      return { ...state, zoomLvl: state.zoomLvl + zoomPercent };
    }
    case "BOX": {
      return state;
    }
    case "POINT": {
      return state;
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

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TOOL": {
      return { ...state, activeTool: action.tool };
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

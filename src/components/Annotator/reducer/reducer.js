const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TOOL": {
      return { ...state, activeTool: action.tool };
    }
    case "BOUNDING_BOX": {
      return state;
    }
    case "POINT": {
      return state;
    }
    case "IMAGE_LOAD": {
      return state;
    }
    default: {
      return state;
    }
  }
};

export default reducer;

const reducer = (state, action) => {
  switch (action.type) {
    case "IMAGE_LOAD":
      console.log(action);
      return state;
    default:
      return state;
  }
};

export default reducer;

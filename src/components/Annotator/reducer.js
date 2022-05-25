export const reducer = (state, action) => {
  if (action.event === "mouseDown") console.log(action);
  switch (action.type) {
    case "pan":
      return state;
    default:
      return state;
  }
};

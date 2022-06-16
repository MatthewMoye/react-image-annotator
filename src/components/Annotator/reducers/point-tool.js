const pointTool = (state, action) => {
  switch (action.event) {
    case "MOUSE_DOWN": {
      if (action.operation === "create") {
        const newRegion = {
          id: `point-${
            state.images[state.activeImageIdx].regions.filter(
              (r) => r.type === "point"
            ).length
          }`,
          type: "point",
          points: [[action.x, action.y]],
        };
        return {
          ...state,
          images: state.images.map((img, imgIdx) => {
            return imgIdx === state.activeImageIdx
              ? { ...img, regions: [...img.regions, newRegion] }
              : img;
          }),
        };
      } else return state;
    }
    default: {
      return state;
    }
  }
};

export default pointTool;

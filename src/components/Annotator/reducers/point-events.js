const pointEvents = (state, action) => {
  const imgIdx = state.activeImageIdx;
  let images = [...state.images];

  switch (action.event) {
    case "MOUSE_MOVE": {
      return state;
    }
    case "MOUSE_DOWN": {
      if (action.operation === "START_MOVE") {
        return { ...state, mode: { mode: "MOVE_POINT" } };
      }
      const newRegion = {
        id: `point-${
          images[imgIdx].regions.filter((r) => r.type === "point").length
        }`,
        type: "point",
        points: [[action.x, action.y]],
      };
      images[imgIdx].regions = [...images[imgIdx].regions, newRegion];
      return { ...state, activeRegionId: newRegion.id, images: images };
    }
    default: {
      return state;
    }
  }
};

export default pointEvents;

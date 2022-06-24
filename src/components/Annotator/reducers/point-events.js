const pointEvents = (state, action) => {
  const imgIdx = state.activeImageIdx;
  let images = [...state.images];

  switch (action.event) {
    case "MOUSE_MOVE": {
      if (state.mode?.mode === "MOVE_POINT") {
        images[imgIdx].regions = images[imgIdx].regions.map((r) =>
          r.id === state.activeRegionId
            ? { ...r, points: [[action.x, action.y]] }
            : r
        );
        return { ...state, images };
      }
      return state;
    }
    case "MOUSE_DOWN": {
      if (state.mode?.mode) {
        return state;
      }
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
      return {
        ...state,
        activeRegionId: newRegion.id,
        activeRegionType: newRegion.type,
        images: images,
      };
    }
    case "MOUSE_UP": {
      if (state.mode?.mode === "MOVE_POINT") {
        return { ...state, mode: {} };
      }
      return state;
    }
    default: {
      return state;
    }
  }
};

export default pointEvents;

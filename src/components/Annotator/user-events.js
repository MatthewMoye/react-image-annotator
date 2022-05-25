import { useRef } from "react";

const userEvents = (dispatch) => {
  const actions = {
    onMouseMove: (e, type, layer, ref) => {
      if (e.button === 2)
        dispatch({
          type: "pan",
          event: "mouseMove",
          layer: layer,
          x: e.pageX - ref?.current?.offsetLeft,
          y: e.pageY - ref?.current?.offsetTop,
        });
      dispatch({
        type: type,
        event: "mouseMove",
        layer: layer,
        x: e.pageX - ref?.current?.offsetLeft,
        y: e.pageY - ref?.current?.offsetTop,
      });
    },
    onMouseDown: (e, type, layer, ref) => {
      if (e.button === 2)
        dispatch({
          type: "pan",
          event: "mouseMove",
          layer: layer,
          x: e.pageX - ref?.current?.offsetLeft,
          y: e.pageY - ref?.current?.offsetTop,
        });
      dispatch({
        type: type,
        event: "mouseDown",
        layer: layer,
        x: e.pageX - ref?.current?.offsetLeft,
        y: e.pageY - ref?.current?.offsetTop,
      });
    },
    onMouseUp: (e, type, layer, ref) => {
      if (e.button === 2)
        dispatch({
          type: "pan",
          event: "mouseMove",
          layer: layer,
          x: e.pageX - ref?.current?.offsetLeft,
          y: e.pageY - ref?.current?.offsetTop,
        });
      dispatch({
        type: type,
        event: "mouseUp",
        layer: layer,
        x: e.pageX - ref?.current?.offsetLeft,
        y: e.pageY - ref?.current?.offsetTop,
      });
    },
    onWheel: (e) => {
      const direction = e.deltaY < 0 ? 1 : e.deltaY > 0 ? -1 : 0;
      console.log(direction);
      dispatch({
        event: "wheel",
        x: e.pageX,
        y: e.pageY,
      });
    },
    onContextMenu: (e) => {
      e.preventDefault();
    },
  };

  return actions;
};

export default userEvents;

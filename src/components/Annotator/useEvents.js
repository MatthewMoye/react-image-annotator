import { useRef } from "react";

const useEvents = (dispatch, activeImageRef, imageContainerRef, activeTool) => {
  const mousePosRef = useRef({ x: 0, y: 0 });
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  const getMousePosition = (e, ref) => {
    return {
      x: e.pageX - ref.current.offsetLeft,
      y: e.pageY - ref.current.offsetTop,
    };
  };

  const updateRefPosition = (ref, mousePos) => {
    if (ref.current?.style) {
      ref.current.style.top = `${
        ref.current.offsetTop - (prevMousePosRef.current.y - mousePos.y)
      }px`;
      ref.current.style.left = `${
        ref.current.offsetLeft - (prevMousePosRef.current.x - mousePos.x)
      }px`;
    }
  };

  let pan, moveImage;

  const events = {
    onMouseMove: (e, type) => {
      mousePosRef.current = getMousePosition(e, activeImageRef);
      if (pan) {
        updateRefPosition(
          imageContainerRef,
          getMousePosition(e, imageContainerRef)
        );
      } else if (moveImage) {
        updateRefPosition(activeImageRef, mousePosRef.current);
      }
      if (type) {
        dispatch({
          type: type,
          event: "mouseMove",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      }
    },
    onMouseDown: (e, type) => {
      if (e.button === 2 || activeTool === "pan") {
        pan = true;
        prevMousePosRef.current = getMousePosition(e, imageContainerRef);
      } else if (activeTool === "moveImage") {
        moveImage = true;
        prevMousePosRef.current = getMousePosition(e, activeImageRef);
      }
      if (type) {
        dispatch({
          type: type,
          event: "mouseDown",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      }
    },
    onMouseUp: (e, type) => {
      moveImage = false;
      pan = false;
      if (type) {
        dispatch({
          type: type,
          event: "mouseUp",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      }
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

  return [mousePosRef, events];
};

export default useEvents;

import { useRef } from "react";

const useEvents = (
  activeImageAngle,
  activeImageRef,
  activeTool,
  dispatch,
  imageContainerRef,
  isMovingImg,
  isPanning,
  zoomLvl
) => {
  const mousePosRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const mvImageStartRef = useRef({ x: 0, y: 0 });

  const getMousePosition = (e) => {
    const { top, left } = activeImageRef.current.getBoundingClientRect();
    const { clientWidth, clientHeight } = activeImageRef.current;
    const activeBorderPix = 3 * zoomLvl;
    return {
      x: (e.pageX - left - activeBorderPix) / clientWidth / zoomLvl,
      y: (e.pageY - top - activeBorderPix) / clientHeight / zoomLvl,
    };
  };

  const updateRefPosition = (ref, angle, mousePos, startPos) => {
    const transform =
      ref.current.style.transform.match(/[-+]?[0-9]*\.?[0-9]+/g);
    const [x, y] = transform
      ? [Number(transform[0]), transform.length > 2 ? Number(transform[1]) : 0]
      : [0, 0];
    const updateX = (mousePos.x - startPos.current.x) / zoomLvl;
    const updateY = (mousePos.y - startPos.current.y) / zoomLvl;
    ref.current.style.transform = `translate(${x + updateX}px, ${
      y + updateY
    }px) rotate(${angle}deg)`;
  };

  const events = {
    onMouseMove: (e, type, operation) => {
      mousePosRef.current = getMousePosition(e);
      console.log(mousePosRef.current);
      // console.log(
      //   "x: ",
      //   Math.cos(activeImageAngle) * (mousePosRef.current.x - 0.5) -
      //     Math.sin(activeImageAngle) * (mousePosRef.current.y - 0.5) +
      //     0.5
      // );
      if (isPanning) {
        updateRefPosition(
          imageContainerRef,
          0,
          { x: e.pageX, y: e.pageY },
          panStartRef
        );
        panStartRef.current = { x: e.pageX, y: e.pageY };
      } else if (isMovingImg) {
        updateRefPosition(
          activeImageRef,
          activeImageAngle,
          { x: e.pageX, y: e.pageY },
          mvImageStartRef
        );
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
      }
      dispatch({
        type: type,
        operation: operation,
        event: "MOUSE_MOVE",
        x: mousePosRef.current.x,
        y: mousePosRef.current.y,
      });
    },
    onMouseDown: (e, type, operation, startMoveImage) => {
      mousePosRef.current = getMousePosition(e);
      if (e.button === 2 || activeTool === "pan") {
        dispatch({ type: "PAN", toggle: true });
        panStartRef.current = { x: e.pageX, y: e.pageY };
      } else if (startMoveImage) {
        dispatch({ type: "MOVE_IMAGE", toggle: true });
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
      }
      if (type) {
        dispatch({
          type: type,
          operation: operation,
          event: "MOUSE_DOWN",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      }
    },
    onMouseUp: (e, type, operation) => {
      mousePosRef.current = getMousePosition(e);
      if (e.button === 2 || activeTool === "pan") {
        dispatch({ type: "PAN", toggle: false });
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
      } else if (e.button === 0) {
        dispatch({ type: "MOVE_IMAGE", toggle: false });
      }
      if (type) {
        dispatch({
          type: type,
          operation: operation,
          event: "MOUSE_UP",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      }
    },
    onMouseLeave: (e) => {
      mousePosRef.current = getMousePosition(e);
      dispatch({ type: "STOP_ALL_ACTIONS" });
    },
    onWheel: (e) => {
      const direction = e.deltaY < 0 ? 1 : e.deltaY > 0 ? -1 : 0;
      dispatch({
        type: "ZOOM",
        event: "WHEEL",
        direction: direction,
      });
    },
    onContextMenu: (e) => {
      e.preventDefault();
    },
  };

  return [mousePosRef, events];
};

export default useEvents;

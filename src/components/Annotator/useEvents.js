import { useRef } from "react";

const useEvents = (
  dispatch,
  activeImageRef,
  activeTool,
  imageContainerRef,
  isMovingImg,
  isPanning,
  zoomLvl
) => {
  const mousePosRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const mvImageStartRef = useRef({ x: 0, y: 0 });

  const getPosition = (e, ref) => {
    return {
      x: e.pageX - ref.current.offsetLeft,
      y: e.pageY - ref.current.offsetTop,
    };
  };

  const getMousePosition = (e) => {
    const { top, left } = activeImageRef.current.getBoundingClientRect();
    return {
      x: (e.pageX - left) / activeImageRef.current.clientWidth / zoomLvl,
      y: (e.pageY - top) / activeImageRef.current.clientHeight / zoomLvl,
    };
  };

  const updateRefPosition = (ref, mousePos, startPos) => {
    const transform = ref.current.style.transform
      .slice(10, -1)
      .replaceAll("px", "")
      .split(", ");
    const [x, y] = transform
      ? [Number(transform[0]), transform.length > 1 ? Number(transform[1]) : 0]
      : [0, 0];
    const updateX = (mousePos.x - startPos.current.x) / zoomLvl;
    const updateY = (mousePos.y - startPos.current.y) / zoomLvl;
    ref.current.style.transform = `translate(${x + updateX}px, ${
      y + updateY
    }px)`;
  };

  const events = {
    onMouseMove: (e, type, operation) => {
      mousePosRef.current = getMousePosition(e);
      if (isPanning) {
        updateRefPosition(
          imageContainerRef,
          getPosition(e, imageContainerRef),
          panStartRef
        );
        panStartRef.current = getPosition(e, imageContainerRef);
      } else if (isMovingImg) {
        updateRefPosition(
          activeImageRef,
          getPosition(e, activeImageRef),
          mvImageStartRef
        );
        mvImageStartRef.current = getPosition(e, activeImageRef);
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
        panStartRef.current = getPosition(e, imageContainerRef);
      } else if (startMoveImage) {
        dispatch({ type: "MOVE_IMAGE", toggle: true });
        mvImageStartRef.current = getPosition(e, activeImageRef);
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
        mvImageStartRef.current = getPosition(e, activeImageRef);
      } else if (e.button === 0)
        dispatch({ type: "MOVE_IMAGE", toggle: false });
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

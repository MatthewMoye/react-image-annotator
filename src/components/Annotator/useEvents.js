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

  const getMousePosition = (e, ref) => {
    return {
      x: e.pageX - ref.current.offsetLeft,
      y: e.pageY - ref.current.offsetTop,
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
    const updateX = (mousePos.current.x - startPos.current.x) / zoomLvl;
    const updateY = (mousePos.current.y - startPos.current.y) / zoomLvl;
    ref.current.style.transform = `translate(${x + updateX}px, ${
      y + updateY
    }px)`;
  };

  const events = {
    onMouseMove: (e, type) => {
      mousePosRef.current = getMousePosition(e, activeImageRef);
      if (isPanning) {
        updateRefPosition(
          imageContainerRef,
          { current: getMousePosition(e, imageContainerRef) },
          panStartRef
        );
        panStartRef.current = getMousePosition(e, imageContainerRef);
      } else if (isMovingImg) {
        updateRefPosition(activeImageRef, mousePosRef, mvImageStartRef);
        mvImageStartRef.current = getMousePosition(e, activeImageRef);
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
    onMouseDown: (e, type, startMoveImage) => {
      if (e.button === 2 || activeTool === "pan") {
        dispatch({ type: "PAN", toggle: true });
        panStartRef.current = getMousePosition(e, imageContainerRef);
      } else if (startMoveImage) {
        dispatch({ type: "MOVE_IMAGE", toggle: true });
        mvImageStartRef.current = getMousePosition(e, activeImageRef);
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
      if (e.button === 2 || activeTool === "pan")
        dispatch({ type: "PAN", toggle: false });
      else if (e.button === 0) dispatch({ type: "MOVE_IMAGE", toggle: false });
      if (type) {
        dispatch({
          type: type,
          event: "mouseUp",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      }
    },
    onMouseLeave: () => {
      dispatch({ type: "STOP_ALL_ACTIONS" });
    },
    onWheel: (e) => {
      const direction = e.deltaY < 0 ? 1 : e.deltaY > 0 ? -1 : 0;
      dispatch({
        type: "ZOOM",
        event: "onWheel",
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

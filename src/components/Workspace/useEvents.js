import { useRef } from "react";

const useEvents = (
  activeImageAngle,
  activeImageRef,
  activeRegionType,
  activeTool,
  dispatch,
  imageContainerRef,
  isMovingImg,
  isPanning,
  mode,
  zoomLvl
) => {
  const mousePosRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const mvImageStartRef = useRef({ x: 0, y: 0 });

  const getMousePosition = (e) => {
    const { clientWidth, clientHeight } = activeImageRef.current;
    const { top, bottom, left, right } =
      activeImageRef.current.getBoundingClientRect();

    const imgCenter = { x: (left + right) / 2, y: (top + bottom) / 2 };

    const xDist = e.pageX - imgCenter.x;
    const yDist = e.pageY - imgCenter.y;

    const sin = Math.sin(-activeImageAngle * (Math.PI / 180));
    const cos = Math.cos(-activeImageAngle * (Math.PI / 180));

    return {
      x: (xDist * cos - sin * yDist) / clientWidth / zoomLvl + 0.5,
      y: (xDist * sin + cos * yDist) / clientHeight / zoomLvl + 0.5,
    };
  };

  const updateRefPosition = (ref, mousePos, startPos) => {
    const transform =
      ref.current.style.transform.match(/[-+]?[0-9]*\.?[0-9]+/g);
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
    onMouseMove: (e) => {
      e.stopPropagation();
      mousePosRef.current = getMousePosition(e);
      if (isPanning) {
        updateRefPosition(
          imageContainerRef,
          { x: e.pageX, y: e.pageY },
          panStartRef
        );
        panStartRef.current = { x: e.pageX, y: e.pageY };
      } else if (isMovingImg) {
        updateRefPosition(
          activeImageRef,
          { x: e.pageX, y: e.pageY },
          mvImageStartRef
        );
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
        return;
      }
      if (activeRegionType) {
        dispatch({
          type: activeRegionType.toUpperCase(),
          event: "MOUSE_MOVE",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      }
    },
    onMouseDown: (e, type, operation, startMoveImage) => {
      e.stopPropagation();
      mousePosRef.current = getMousePosition(e);
      if (e.button === 2 || activeTool === "pan") {
        dispatch({ type: "PAN", toggle: true });
        panStartRef.current = { x: e.pageX, y: e.pageY };
        return;
      } else if (startMoveImage && activeTool === "moveImage") {
        dispatch({ type: "IMAGE", event: "MOVE", toggle: true });
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
        return;
      }
      if ((activeRegionType && operation) || type) {
        dispatch({
          type: type ? type : activeRegionType.toUpperCase(),
          operation: operation,
          event: "MOUSE_DOWN",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      } else if (
        e.button === 0 &&
        !startMoveImage &&
        mode?.mode === undefined
      ) {
        dispatch({
          type: "UNSELECT",
          event: "MOUSE_DOWN",
        });
      }
    },
    onMouseUp: (e, operation) => {
      e.stopPropagation();
      mousePosRef.current = getMousePosition(e);
      if (e.button === 2 || activeTool === "pan") {
        dispatch({ type: "PAN", toggle: false });
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
      } else if (e.button === 0 && activeTool === "moveImage") {
        dispatch({ type: "IMAGE", event: "MOVE", toggle: false });
        return;
      }
      if (activeRegionType && operation) {
        dispatch({
          type: activeRegionType.toUpperCase(),
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
      e.stopPropagation();
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

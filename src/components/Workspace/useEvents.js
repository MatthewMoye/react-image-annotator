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
    const { top, bottom, left, right } =
      activeImageRef.current.getBoundingClientRect();
    const { clientWidth, clientHeight } = activeImageRef.current;

    const imgCenter = { x: (left + right) / 2, y: (top + bottom) / 2 };
    let sinAngle = Math.sin(activeImageAngle * (Math.PI / 180));
    let cosAngle = Math.cos(activeImageAngle * (Math.PI / 180));

    const imgOrig = {
      left:
        imgCenter.x -
        (cosAngle * (clientWidth / 2) - sinAngle * (clientHeight / 2)) *
          zoomLvl,
      top:
        imgCenter.y -
        (sinAngle * (clientWidth / 2) + cosAngle * (clientHeight / 2)) *
          zoomLvl,
    };

    const newX = e.pageX - imgOrig.left;
    const newY = e.pageY - imgOrig.top;

    sinAngle = Math.sin(-activeImageAngle * (Math.PI / 180));
    cosAngle = Math.cos(-activeImageAngle * (Math.PI / 180));

    return {
      x: (newX * cosAngle - sinAngle * newY) / clientWidth / zoomLvl,
      y: (newX * sinAngle + cosAngle * newY) / clientHeight / zoomLvl,
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
    onMouseMove: (e, type, operation) => {
      mousePosRef.current = getMousePosition(e);
      console.log(mousePosRef.current);
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

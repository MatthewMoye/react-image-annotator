import { useRef } from "react";

const useEvents = (
  dispatch,
  activeImageRef,
  activeTool,
  imageContainerRef,
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
    const { offsetLeft, offsetTop } = ref.current;
    const yChange = mousePos.current.y - startPos.current.y;
    const xChange = mousePos.current.x - startPos.current.x;
    console.log(yChange);
    ref.current.style.top = `${offsetTop + yChange * (moveImage ? 2 : 1)}px`;
    ref.current.style.left = `${offsetLeft + xChange * (moveImage ? 2 : 1)}px`;
  };

  let pan, moveImage;

  const events = {
    onMouseMove: (e, type) => {
      mousePosRef.current = getMousePosition(e, activeImageRef);
      if (pan) {
        updateRefPosition(
          imageContainerRef,
          { current: getMousePosition(e, imageContainerRef) },
          panStartRef
        );
      } else if (moveImage) {
        updateRefPosition(activeImageRef, mousePosRef, mvImageStartRef);
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
        pan = true;
        panStartRef.current = getMousePosition(e, imageContainerRef);
      } else if (startMoveImage) {
        moveImage = true;
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
      if (e.button === 0) {
        moveImage = false;
      } else if (e.button === 2) {
        pan = false;
      }
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
      moveImage = false;
      pan = false;
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

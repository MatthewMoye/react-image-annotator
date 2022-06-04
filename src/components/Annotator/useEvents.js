import { useRef } from "react";

const useEvents = (dispatch, activeImageRef, imageContainerRef, activeTool) => {
  const mousePos = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  let pan = false;

  const actions = {
    onMouseMove: (e, type) => {
      if (pan) {
        mousePos.current = {
          x: e.pageX - imageContainerRef.current.offsetLeft,
          y: e.pageY - imageContainerRef.current.offsetTop,
        };
        imageContainerRef.current.style.top = `${
          imageContainerRef.current.offsetTop -
          (prevMousePos.current.y - mousePos.current.y)
        }px`;
        imageContainerRef.current.style.left = `${
          imageContainerRef.current.offsetLeft -
          (prevMousePos.current.x - mousePos.current.x)
        }px`;
        return;
      }
      mousePos.current = {
        x: e.pageX - activeImageRef.current?.offsetLeft,
        y: e.pageY - activeImageRef.current?.offsetTop,
      };
      console.log(mousePos.current);
      if (type) {
        dispatch({
          type: type,
          event: "mouseMove",
          x: mousePos.current.x,
          y: mousePos.current.y,
        });
      }
    },
    onMouseDown: (e, type) => {
      if (e.button === 2 || activeTool === "pan") {
        pan = true;
        prevMousePos.current = {
          x: e.pageX - imageContainerRef.current.offsetLeft,
          y: e.pageY - imageContainerRef.current.offsetTop,
        };
      }
      if (type) {
        dispatch({
          type: type,
          event: "mouseDown",
          x: mousePos.current.x,
          y: mousePos.current.y,
        });
      }
    },
    onMouseUp: (e, type) => {
      pan = false;
      if (type) {
        dispatch({
          type: type,
          event: "mouseUp",
          x: mousePos.current.x,
          y: mousePos.current.y,
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

  return [mousePos, actions];
};

export default useEvents;

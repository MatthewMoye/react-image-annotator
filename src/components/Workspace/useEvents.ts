import {
  setIsMovingImg,
  setIsPanning,
  zoom,
} from "features/workspaceSlice/workspaceSlice";
import {
  Dispatch,
  MouseEvent,
  WheelEvent,
  RefObject,
  MutableRefObject,
  useRef,
} from "react";
import { useAppDispatch, useAppSelector } from "reduxHooks";
import { Coord } from "types/coord";
import { Mode } from "types/mode";

export type CustomEvents = {
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseDown: (
    e: MouseEvent<HTMLElement | SVGElement>,
    operation?: string
  ) => void;
  onMouseUp: (e: MouseEvent<HTMLElement>, operation?: string) => void;
  onMouseLeave: (e: MouseEvent<HTMLElement>) => void;
  onWheel: (e: WheelEvent<HTMLElement>) => void;
  onContextMenu: (e: MouseEvent<HTMLElement>) => void;
};

const useEvents = (
  activeImageAngle: number,
  activeImageRef: RefObject<HTMLDivElement>,
  activeRegionType: string,
  dispatch: Dispatch<any>,
  imageContainerRef: RefObject<HTMLDivElement>,
  mode: Mode
) => {
  const reduxDispatch = useAppDispatch();
  const { activeTool, isMovingImg, isPanning, zoomLvl } = useAppSelector(
    (state) => state.workspace
  );

  const mousePosRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const mvImageStartRef = useRef({ x: 0, y: 0 });

  const getMousePosition = (e: MouseEvent<HTMLElement | SVGElement>) => {
    if (!activeImageRef.current) return { x: 0, y: 0 };
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

  const updateRefPosition = (
    ref: RefObject<HTMLDivElement>,
    mousePos: Coord,
    startPos: MutableRefObject<Coord>
  ) => {
    if (!ref.current) return;
    const { m41: x, m42: y } = new DOMMatrixReadOnly(
      ref.current.style.transform
    );
    const updateX = (mousePos.x - startPos.current.x) / zoomLvl;
    const updateY = (mousePos.y - startPos.current.y) / zoomLvl;
    ref.current.style.transform = `translate(${x + updateX}px, ${
      y + updateY
    }px)`;
  };

  const events: CustomEvents = {
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
    onMouseDown: (e, operation) => {
      e.stopPropagation();
      mousePosRef.current = getMousePosition(e);
      if (e.button === 2 || activeTool === "pan") {
        reduxDispatch(setIsPanning(true));
        panStartRef.current = { x: e.pageX, y: e.pageY };
        return;
      } else if (operation === "MOVE_IMAGE" && activeTool === "moveImage") {
        reduxDispatch(setIsMovingImg(true));
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
        return;
      }
      if (operation?.includes("CREATE_NEW")) {
        const regionType = operation.replace("CREATE_NEW_", "");
        dispatch({
          type: regionType,
          operation: operation,
          event: "MOUSE_DOWN",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      } else if (activeRegionType && operation) {
        dispatch({
          type: activeRegionType.toUpperCase(),
          operation: operation,
          event: "MOUSE_DOWN",
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      } else if (e.button === 0 && mode?.mode === undefined) {
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
        reduxDispatch(setIsPanning(false));
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
      } else if (e.button === 0 && activeTool === "moveImage") {
        reduxDispatch(setIsMovingImg(false));
        return;
      }
      if (activeRegionType) {
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
      reduxDispatch(setIsPanning(false));
      reduxDispatch(setIsMovingImg(false));
    },
    onWheel: (e) => {
      e.stopPropagation();
      const direction = e.deltaY < 0 ? 1 : e.deltaY > 0 ? -1 : 0;
      reduxDispatch(zoom(direction));
    },
    onContextMenu: (e) => {
      e.preventDefault();
    },
  };

  return { mousePosRef, events };
};

export default useEvents;

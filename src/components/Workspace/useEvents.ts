import {
  MouseEvent,
  WheelEvent,
  RefObject,
  MutableRefObject,
  useRef,
} from "react";
import { useAppDispatch, useAppSelector } from "reduxHooks";
import {
  setIsMovingImg,
  setIsPanning,
  zoom,
} from "features/toolSlice/toolSlice";
import {
  createPoint,
  mouseMoveBoxTransform,
  mouseMoveCreateBox,
  movePoint,
  selectRegion,
  startCreateBox,
  startPointMove,
  stopBoxTransform,
  stopCreateBox,
  stopPointMove,
} from "features/regionSlice/regionSlice";
import { Coord } from "types/coord";

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
  activeImageRef: RefObject<HTMLDivElement>,
  imageContainerRef: RefObject<HTMLDivElement>
) => {
  const dispatch = useAppDispatch();
  const { activeTool, isMovingImg, isPanning, zoomLvl } = useAppSelector(
    (state) => state.tool
  );
  const { activeImageIdx, images } = useAppSelector((state) => state.image);
  const { activeRegionType, mode } = useAppSelector((state) => state.region);
  const activeImageAngle = images[activeImageIdx]?.angle;
  const activeImageId = images[activeImageIdx]?.id;

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
      const { x, y } = mousePosRef.current;
      switch (activeRegionType) {
        case "POINT":
          if (mode.operation === "MOVE_POINT") dispatch(movePoint(x, y));
          break;
        case "BOX":
          if (mode.operation === "CREATE_BOX")
            dispatch(mouseMoveCreateBox(x, y));
          else if (mode.operation === "BOX_TRANSFORM")
            dispatch(mouseMoveBoxTransform(x, y));
          break;
      }
    },
    onMouseDown: (e, actionType) => {
      e.stopPropagation();
      mousePosRef.current = getMousePosition(e);
      if (e.button === 2 || activeTool === "pan") {
        dispatch(setIsPanning(true));
        panStartRef.current = { x: e.pageX, y: e.pageY };
        return;
      } else if (actionType === "MOVE_IMAGE" && activeTool === "moveImage") {
        dispatch(setIsMovingImg(true));
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
        return;
      }
      const isCreateTool = activeTool.includes("create");
      if (isCreateTool && !actionType && e.button === 0) {
        const regionType = activeTool.replace("create", "").toUpperCase();
        const { x, y } = mousePosRef.current;
        switch (regionType) {
          case "POINT":
            dispatch(createPoint(x, y, activeImageId));
            break;
          case "BOX":
            dispatch(startCreateBox(x, y, activeImageId));
            break;
        }
      } else if (activeRegionType && actionType) {
        switch (activeRegionType) {
          case "POINT":
            if (actionType === "START_MOVE") dispatch(startPointMove());
            break;
          case "BOX":
            break;
        }
      } else if (e.button === 0 && !mode.operation) {
        dispatch(selectRegion("", ""));
      }
    },
    onMouseUp: (e) => {
      e.stopPropagation();
      mousePosRef.current = getMousePosition(e);
      if (e.button === 2 || activeTool === "pan") {
        dispatch(setIsPanning(false));
        mvImageStartRef.current = { x: e.pageX, y: e.pageY };
      } else if (e.button === 0 && activeTool === "moveImage") {
        dispatch(setIsMovingImg(false));
        return;
      }
      switch (activeRegionType) {
        case "POINT":
          if (mode.operation === "MOVE_POINT") dispatch(stopPointMove());
          break;
        case "BOX":
          if (mode.operation === "CREATE_BOX") dispatch(stopCreateBox());
          else if (mode.operation === "BOX_TRANSFORM")
            dispatch(stopBoxTransform());
          break;
      }
    },
    onMouseLeave: (e) => {
      mousePosRef.current = getMousePosition(e);
      dispatch(setIsPanning(false));
      dispatch(setIsMovingImg(false));
    },
    onWheel: (e) => {
      e.stopPropagation();
      const direction = e.deltaY < 0 ? 1 : e.deltaY > 0 ? -1 : 0;
      dispatch(zoom(direction));
    },
    onContextMenu: (e) => {
      e.preventDefault();
    },
  };

  return { mousePosRef, events };
};

export default useEvents;

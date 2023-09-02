import { Dispatch, MouseEvent } from "react";
import { useAppSelector } from "reduxHooks";
import { Region } from "types/region";
import { CustomEvents } from "components/Workspace/useEvents";
import { Image, ImageMargin } from "types/image";
import styles from "./Box.module.css";

type BoxHighlightAndTransformProps = {
  activeRegionId: string;
  dispatch: Dispatch<any>;
  events: CustomEvents;
  img: Image;
  imgMargin: ImageMargin;
  r: Region;
};

const BoxHighlightAndTransform = ({
  activeRegionId,
  dispatch,
  events,
  img,
  imgMargin,
  r,
}: BoxHighlightAndTransformProps) => {
  const { zoomLvl } = useAppSelector((state) => state.workspace);

  const pointList = r.points.map((p) => [
    p[0] * img.width + imgMargin.width,
    p[1] * img.height + imgMargin.height,
  ]);
  const isActive = activeRegionId === r.id;

  const handleRegionSelect = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.button === 0) {
      e.stopPropagation();
      if (!isActive) {
        dispatch({ type: "SELECT_REGION", regionId: r.id, regionType: r.type });
      }
    }
  };

  const startTransform = (e: MouseEvent<HTMLDivElement>, point: number) => {
    e.preventDefault();
    if (e.button === 0) {
      e.stopPropagation();
      if (isActive) {
        dispatch({ type: "BOX", event: "START_TRANSFORM", point: point });
      }
    }
  };

  const stopTransform = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      e.stopPropagation();
      if (isActive) {
        events.onMouseUp(e, "STOP_TRANSFORM");
      }
    }
  };

  const lineDistance = (p1: number[], p2: number[]) =>
    Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

  const lineMidpoint2D = (p1: number[], p2: number[]) => [
    (p1[0] + p2[0]) / 2,
    (p1[1] + p2[1]) / 2,
  ];

  const translatePoints = [
    ...pointList,
    lineMidpoint2D(pointList[0], pointList[1]),
    lineMidpoint2D(pointList[1], pointList[2]),
    lineMidpoint2D(pointList[2], pointList[3]),
    lineMidpoint2D(pointList[3], pointList[0]),
    lineMidpoint2D(pointList[0], pointList[2]),
  ];

  return (
    <>
      <div
        className={styles[`highlightBox${isActive ? "Active" : ""}`]}
        style={{
          top: Math.min(...pointList.map((p) => p[1])) - 4,
          left: Math.min(...pointList.map((p) => p[0])) - 4,
          width: lineDistance(pointList[0], pointList[1]) + 8,
          height: lineDistance(pointList[0], pointList[3]) + 8,
        }}
        onMouseDown={handleRegionSelect}
      />
      {isActive &&
        translatePoints.map((point, idx) => (
          <div
            key={`${r.id}-corner-${idx}`}
            style={{
              top: point[1] - (idx < 4 ? 5 : 3),
              left: point[0] - (idx < 4 ? 5 : 3),
              position: "absolute",
              width: idx < 4 ? 6 : 3,
              height: idx < 4 ? 6 : 3,
              border: "2px solid white",
              transform: `scale(${1 / Math.min(zoomLvl / 1.5, 1)})`,
              msTransform: `scale(${1 / Math.min(zoomLvl / 1.5, 1)})`,
              WebkitTransform: `scale(${1 / Math.min(zoomLvl / 1.5, 1)})`,
            }}
            onMouseDown={(e) => startTransform(e, idx)}
            onMouseUp={(e) => stopTransform(e)}
          />
        ))}
    </>
  );
};

export default BoxHighlightAndTransform;

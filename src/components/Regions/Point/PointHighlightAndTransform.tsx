import { MouseEvent } from "react";
import { Region } from "types/region";
import styles from "./Point.module.css";
import { Image, ImageMargin } from "types/image";
import { CustomEvents } from "components/Workspace/useEvents";
import { useAppDispatch, useAppSelector } from "reduxHooks";
import { selectRegion } from "features/regionSlice/regionSlice";

type PointHighlightAndTransformProps = {
  events: CustomEvents;
  img: Image;
  imgMargin: ImageMargin;
  r: Region;
};

const PointHighlightAndTransform = ({
  events,
  img,
  imgMargin,
  r,
}: PointHighlightAndTransformProps) => {
  const dispatch = useAppDispatch();
  const { activeRegionId } = useAppSelector((state) => state.region);

  const xPos = r.points[0][0] * img.width + imgMargin.width;
  const yPos = r.points[0][1] * img.height + imgMargin.height;
  const isActive = activeRegionId === r.id;

  const handleRegionSelect = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.button === 0) {
      e.stopPropagation();
      if (!isActive) {
        dispatch(selectRegion(r.id, r.type));
      } else {
        events.onMouseDown(e, "START_MOVE");
      }
    }
  };

  return (
    <div
      className={styles[`highlightBox${isActive ? "Active" : ""}`]}
      style={{
        top: yPos - 14,
        left: xPos - 14,
        width: "27px",
        height: "27px",
      }}
      onMouseDown={handleRegionSelect}
    />
  );
};

export default PointHighlightAndTransform;

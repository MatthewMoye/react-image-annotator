import styles from "./Point.module.css";

const PointHighlightAndTransform = ({
  activeRegionId,
  dispatch,
  events,
  img,
  imgMargin,
  r,
}) => {
  const xPos = r.points[0][0] * img.width + imgMargin.width;
  const yPos = r.points[0][1] * img.height + imgMargin.height;
  const isActive = activeRegionId === r.id;

  const handleRegionSelect = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      e.stopPropagation();
      if (!isActive) {
        dispatch({ type: "SELECT_REGION", regionId: r.id, regionType: r.type });
      } else {
        events.onMouseDown(e, null, "START_MOVE");
      }
    }
  };

  const stopTransform = (e) => {
    if (e.button === 0) {
      e.stopPropagation();
      if (isActive) {
        events.onMouseUp(e, "STOP_MOVE");
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
      onMouseUp={stopTransform}
    />
  );
};

export default PointHighlightAndTransform;

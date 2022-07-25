import styles from "./Box.module.css";

const BoxHighlightAndTransform = ({
  activeRegionId,
  dispatch,
  events,
  img,
  imgMargin,
  r,
}) => {
  const pointList = r.points.map((p) => [
    p[0] * img.width + imgMargin.width,
    p[1] * img.height + imgMargin.height,
  ]);
  const isActive = activeRegionId === r.id;

  const handleRegionSelect = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      e.stopPropagation();
      if (!isActive) {
        dispatch({ type: "SELECT_REGION", regionId: r.id, regionType: r.type });
      }
    }
  };

  const startTransform = (e, point) => {
    e.preventDefault();
    if (e.button === 0) {
      e.stopPropagation();
      if (!isActive) {
        dispatch({ type: "BOX", event: "START_TRANSFORM", point: point });
      }
    }
  };

  const stopTransform = (e) => {
    if (e.button === 0) {
      e.stopPropagation();
      if (isActive) {
        events.onMouseUp(e, "STOP_TRANSFORM");
      }
    }
  };

  const lineDistance = (p1, p2) =>
    Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

  return (
    <div
      className={styles[`highlightBox${isActive ? "Active" : ""}`]}
      style={{
        top: pointList[0][1] - 4,
        left: pointList[0][0] - 4,
        width: lineDistance(pointList[0], pointList[1]) + 8,
        height: lineDistance(pointList[0], pointList[3]) + 8,
      }}
      onMouseDown={handleRegionSelect}
    >
      {isActive &&
        [
          { top: -2, left: -2 },
          { top: -2, right: -2 },
          { bottom: -2, right: -2 },
          { bottom: -2, left: -2 },
          { margin: "auto", top: 0, bottom: 0, left: 0, right: 0 },
        ].map((pos, idx) => (
          <div
            key={`${r.id}-corner-${idx}`}
            style={{
              ...pos,
              position: "absolute",
              width: 8,
              height: 8,
              backgroundColor: "#FFFFFF70",
            }}
            onMouseDown={(e) => startTransform(e, idx)}
            onMouseUp={(e) => stopTransform(e, idx)}
          />
        ))}
    </div>
  );
};

export default BoxHighlightAndTransform;

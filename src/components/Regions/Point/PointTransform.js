const PointTransform = ({ activeRegionType, events, img, imgMargin, r }) => {
  const xPos = r.points[0][0] * img.width + imgMargin.width;
  const yPos = r.points[0][1] * img.height + imgMargin.height;

  const startTransform = (e) => {
    if (e.button === 0) {
      events.onMouseDown(e, null, "START_MOVE");
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const stopTransform = (e) => {
    if (e.button === 0) {
      events.onMouseDown(e);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: yPos - 14,
        left: xPos - 14,
        width: "27px",
        height: "27px",
      }}
      onMouseDown={startTransform}
      onMouseUp={stopTransform}
    />
  );
};

export default PointTransform;

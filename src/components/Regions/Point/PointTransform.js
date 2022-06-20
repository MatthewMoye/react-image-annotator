const PointTransform = ({ events, img, imgMargin, r }) => {
  const xPos = r.points[0][0] * img.width + imgMargin.width;
  const yPos = r.points[0][1] * img.height + imgMargin.height;

  const startTransform = (e) => {
    e.stopPropagation();
    if (e.button === 0) {
      events.onMouseDown(e, "POINT", "START_MOVE");
    }
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
    />
  );
};

export default PointTransform;

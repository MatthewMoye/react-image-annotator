const Regions = ({
  dispatch,
  events,
  imgMargin,
  mousePositionRef,
  zoomLvl,
}) => {
  console.log(mousePositionRef.current);
  console.log(imgMargin);
  return (
    <g
      transform={`translate(${
        mousePositionRef.current.x / zoomLvl + imgMargin.width
      } ${mousePositionRef.current.y / zoomLvl + imgMargin.height})`}
    >
      <path
        d={"M0 8L8 0L0 -8L-8 0Z"}
        strokeWidth={2}
        stroke={"red"}
        fill="transparent"
      />
    </g>
  );
};

export default Regions;

const Point = ({
  activeRegionId,
  dispatch,
  img,
  imgMargin,
  isActiveImg,
  r,
}) => {
  const xPos = r.points[0][0] * img.width + imgMargin.width;
  const yPos = r.points[0][1] * img.height + imgMargin.height;
  return (
    <g key={`${r.id}-g`} transform={`translate(${xPos} ${yPos})`}>
      <circle
        key={`${r.id}-point`}
        stroke={"red"}
        strokeWidth={1}
        fill={"#d7000050"}
        r={"5"}
      />
    </g>
  );
};

export default Point;

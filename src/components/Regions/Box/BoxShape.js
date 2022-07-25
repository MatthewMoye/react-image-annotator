import { memo } from "react";

const BoxShape = memo(({ img, imgMargin, r }) => {
  const pointList = r.points.map((p) => [
    p[0] * img.width + imgMargin.width,
    p[1] * img.height + imgMargin.height,
  ]);
  return (
    <polygon
      points={pointList}
      stroke={"red"}
      strokeWidth={2}
      fill={"#d7000050"}
    />
  );
});

export default BoxShape;

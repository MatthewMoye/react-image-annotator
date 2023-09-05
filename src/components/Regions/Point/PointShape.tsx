import { memo } from "react";
import { Image, ImageMargin } from "types/image";
import { Region } from "types/region";

type PointShapeProps = {
  img: Image;
  imgMargin: ImageMargin;
  r: Region;
};

// eslint-disable-next-line react/display-name
const PointShape = memo(({ img, imgMargin, r }: PointShapeProps) => {
  const xPos = r.points[0][0] * img.width + imgMargin.width;
  const yPos = r.points[0][1] * img.height + imgMargin.height;
  return (
    <g transform={`translate(${xPos} ${yPos})`} width={"200px"}>
      <circle stroke={"red"} strokeWidth={2} fill={"#d7000050"} r={"8"} />
    </g>
  );
});

export default PointShape;

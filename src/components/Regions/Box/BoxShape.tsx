import { memo } from "react";
import { Image, ImageMargin } from "types/image";
import { Region } from "types/region";

type BoxShapeProps = {
  img: Image;
  imgMargin: ImageMargin;
  r: Region;
};

const BoxShape = memo(({ img, imgMargin, r }: BoxShapeProps) => {
  const pointList = r.points.map((p) => [
    p[0] * img.width + imgMargin.width,
    p[1] * img.height + imgMargin.height,
  ]);
  return (
    <polygon
      points={pointList.map((a) => a.join(" ")).join(" ")}
      stroke={"red"}
      strokeWidth={2}
      fill={"#d7000050"}
    />
  );
});

export default BoxShape;

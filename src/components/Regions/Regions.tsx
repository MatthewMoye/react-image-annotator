import React from "react";
import BoxHighlightAndTransform from "./Box/BoxHighlightAndTransform";
import BoxShape from "./Box/BoxShape";
import PointHighlightAndTransform from "./Point/PointHighlightAndTransform";
import PointShape from "./Point/PointShape";
import { Image, ImageMargin } from "types/image";
import { CustomEvents } from "components/Workspace/useEvents";
import { useAppSelector } from "reduxHooks";

type RegionsProps = {
  events: CustomEvents;
  img: Image;
  imgIsActive: boolean;
  imgMargin: ImageMargin;
};

const regionShapes = {
  point: PointShape,
  box: BoxShape,
};

const regionHighlightAndTransform = {
  point: PointHighlightAndTransform,
  box: BoxHighlightAndTransform,
};

const Regions = ({ events, img, imgIsActive, imgMargin }: RegionsProps) => {
  const { regions } = useAppSelector((state) => state.region);

  const imgRegions = regions.filter((r) => r.imageId === img.id);

  return (
    <div
      style={{
        width: `${img.width + imgMargin.width * 2}px`,
        height: `${img.height + imgMargin.height * 2}px`,
        position: "absolute",
      }}
    >
      <svg style={{ width: "100%", height: "100%" }}>
        {imgRegions.map((r) => {
          const Shape = regionShapes[r.type as keyof typeof regionShapes];
          return (
            <Shape
              key={`region-${r.id}`}
              img={img}
              imgMargin={imgMargin}
              r={r}
            />
          );
        })}
      </svg>
      {imgIsActive &&
        imgRegions.map((r) => {
          const HighlightAndTransform =
            regionHighlightAndTransform[
              r.type as keyof typeof regionHighlightAndTransform
            ];
          return (
            <React.Fragment key={`region-events-${r.id}`}>
              <HighlightAndTransform
                events={events}
                img={img}
                imgMargin={imgMargin}
                r={r}
              />
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Regions;

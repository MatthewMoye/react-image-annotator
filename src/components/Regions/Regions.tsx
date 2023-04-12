import React, { Dispatch, MouseEvent } from "react";
import BoxHighlightAndTransform from "./Box/BoxHighlightAndTransform";
import BoxShape from "./Box/BoxShape";
import PointHighlightAndTransform from "./Point/PointHighlightAndTransform";
import PointShape from "./Point/PointShape";
import { Image, ImageMargin } from "types/image";
import { CustomEvents } from "components/Workspace/useEvents";

type RegionsProps = {
  activeRegionId: string;
  activeTool: string;
  dispatch: Dispatch<any>;
  events: CustomEvents;
  img: Image;
  imgMargin: ImageMargin;
  zoomLvl: number;
};

const regionShapes = {
  point: PointShape,
  box: BoxShape,
};

const regionHighlightAndTransform = {
  point: PointHighlightAndTransform,
  box: BoxHighlightAndTransform,
};

const Regions = ({
  activeRegionId,
  activeTool,
  dispatch,
  events,
  img,
  imgMargin,
  zoomLvl,
}: RegionsProps) => {
  const handleMouseDown = (e: MouseEvent<SVGElement>) => {
    if (e.button === 0 && activeTool.includes("create")) {
      events.onMouseDown(e, "CREATE_NEW_" + activeTool.slice(6).toUpperCase());
    }
  };

  return (
    <div
      style={{
        width: `${img.width + imgMargin.width * 2}px`,
        height: `${img.height + imgMargin.height * 2}px`,
        position: "absolute",
      }}
    >
      <svg
        key={`annotation-list-${img.id}`}
        style={{ width: "100%", height: "100%" }}
        onMouseDown={handleMouseDown}
      >
        {img.regions.map((r) => {
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
      {img.width &&
        img.height &&
        img.regions.map((r) => {
          const HighlightAndTransform =
            regionHighlightAndTransform[
              r.type as keyof typeof regionHighlightAndTransform
            ];
          return (
            <React.Fragment key={`region-select-${r.id}`}>
              <HighlightAndTransform
                key={`region-highlight-transform-${r.id}`}
                activeRegionId={activeRegionId}
                dispatch={dispatch}
                events={events}
                img={img}
                imgMargin={imgMargin}
                r={r}
                zoomLvl={zoomLvl}
              />
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Regions;

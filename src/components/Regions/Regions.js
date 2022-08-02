import React from "react";
import BoxHighlightAndTransform from "./Box/BoxHighlightAndTransform";
import BoxShape from "./Box/BoxShape";
import PointHighlightAndTransform from "./Point/PointHighlightAndTransform";
import PointShape from "./Point/PointShape";

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
}) => {
  const handleMouseDown = (e) => {
    if (e.button === 0 && activeTool.includes("create")) {
      events.onMouseDown(e, activeTool.slice(6).toUpperCase(), "create");
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
          const Shape = regionShapes[r.type];
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
          const HighlightAndTransform = regionHighlightAndTransform[r.type];
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

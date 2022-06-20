import PointHighlight from "./Point/PointHighlight";
import PointShape from "./Point/PointShape";

const regionShapes = {
  point: PointShape,
};

const regionHighlight = {
  point: PointHighlight,
};

const Regions = ({
  activeRegionId,
  activeTool,
  dispatch,
  events,
  img,
  imgMargin,
}) => {
  const handleMouseDown = (e) => {
    if (e.button === 0 && activeTool.includes("create")) {
      events.onMouseDown(e, activeTool.slice(6).toUpperCase(), "create");
    }
  };

  // let activeRegion;
  // if (activeRegionId) {
    // activeRegion = img.regions.find((r) => r.id === activeRegionId);
    // if (activeRegion) {
    //   Transform = regionTransform[activeRegion.type];
    // }
  // }

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
        {img.regions.map((r, idx) => {
          const Shape = regionShapes[r.type];
          if (!Shape) {
            return <div key={`unknown-shape-type-${r.type}-${idx}`} />;
          }
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
      {img.regions.map((r, idx) => {
        const Highlight = regionHighlight[r.type];
        if (!Highlight) {
          return <div key={`unknown-highlight-type-${r.type}-${idx}`} />;
        }
        return (
          <Highlight
            key={`region-highlight-${r.id}`}
            activeRegionId={activeRegionId}
            dispatch={dispatch}
            img={img}
            imgMargin={imgMargin}
            r={r}
          />
        );
      })}
    </div>
  );
};

export default Regions;

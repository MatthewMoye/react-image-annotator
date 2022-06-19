import Point from "./Point/Point";
import styles from "./Regions.module.css";

const toolRegions = {
  point: Point,
};

const Regions = ({
  activeRegionId,
  activeTool,
  dispatch,
  events,
  img,
  imgMargin,
  isActiveImg,
}) => {
  const handleMouseDown = (e) => {
    if (e.button === 0 && activeTool.includes("create")) {
      events.onMouseDown(e, activeTool.slice(6).toUpperCase(), "create");
    }
  };

  return (
    <svg
      key={`annotation-list-${img.id}`}
      className={styles.annotationList}
      style={{
        width: `${img.width + imgMargin.width * 2}px`,
        height: `${img.height + imgMargin.height * 2}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {img.regions.map((r, idx) => {
        const RegionComponent = toolRegions[r.type];
        if (!RegionComponent) {
          return <div key={`unknown-type-${r.type}-${idx}`} />;
        }
        return (
          <RegionComponent
            key={`region-${r.id}`}
            activeRegionId={activeRegionId}
            dispatch={dispatch}
            img={img}
            imgMargin={imgMargin}
            isActiveImg={isActiveImg}
            r={r}
          />
        );
      })}
    </svg>
  );
};

export default Regions;

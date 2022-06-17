import styles from "./Regions.module.css";

const Regions = ({
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
        zIndex: isActiveImg ? 1 : 0,
        width: `${img.width + imgMargin.width * 2}px`,
        height: `${img.height + imgMargin.height * 2}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {img.regions.map((r) => {
        // filter by type of region
        const xPos = r.points[0][0] * img.width + imgMargin.width;
        const yPos = r.points[0][1] * img.height + imgMargin.height;
        return (
          <g key={`${r.id}-g`} transform={`translate(${xPos} ${yPos})`}>
            <path
              key={`${r.id}-path`}
              d={"M0 8L8 0L0 -8L-8 0Z"}
              strokeWidth={2}
              stroke={"red"}
              fill="transparent"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default Regions;

import Regions from "../Regions/Regions";
import styles from "./Workspace.module.css";

const Workspace = ({
  activeImageIdx,
  activeImageRef,
  activeTool,
  dispatch,
  events,
  imageContainerRef,
  images,
  mousePositionRef,
  zoomLvl,
}) => {
  const onImgLoad = (e) => {
    dispatch({
      type: "LOAD_IMAGE",
      id: e.target.id,
      w: e.target.naturalWidth,
      h: e.target.naturalHeight,
    });
  };

  const handleImgMouseDown = (e, idx) => {
    if (e.button !== 0) return;
    if (activeTool === "selectImage") {
      dispatch({ type: "SET_ACTIVE_IMAGE", idx: idx });
    } else if (activeTool === "rotate" && activeImageIdx === idx) {
      dispatch({ type: "ROTATE_IMAGE" });
    } else if (activeTool === "moveImage" && activeImageIdx === idx) {
      events.onMouseDown(e, null, true);
    }
  };

  return (
    <div className={styles.workspaceContainer} {...events}>
      <div
        className={styles.imgListContainer}
        style={{
          transform: `scale(${zoomLvl})`,
          msTransform: `scale(${zoomLvl})`,
          WebkitTransform: `scale(${zoomLvl})`,
        }}
      >
        <div className={styles.imgList} ref={imageContainerRef}>
          {images.map((img, imgIdx) => {
            const isActiveImg = activeImageIdx === imgIdx;
            const imgMargin = {
              width: 0.1 * img.width,
              height: 0.1 * img.height,
            };
            return (
              <div
                key={`img-container-${img.id}`}
                className={styles.imageContainer}
                style={{
                  minWidth: `${Math.max(img.width, img.height)}px`,
                  minHeight: `${Math.max(img.width, img.height)}px`,
                  margin: `${imgMargin.height}px ${imgMargin.width}px`,
                }}
              >
                <div
                  key={`img-box-${img.id}`}
                  onMouseDown={(e) => handleImgMouseDown(e, imgIdx)}
                  className={styles.imgBox}
                  style={{ zIndex: isActiveImg ? 1 : 0 }}
                  ref={isActiveImg ? activeImageRef : null}
                >
                  <img
                    key={`img-${img.id}`}
                    id={img.id}
                    src={img.src}
                    alt={img.alt}
                    onLoad={onImgLoad}
                    style={{
                      zIndex: isActiveImg ? 1 : 0,
                      width: `${img.width}px`,
                      height: `${img.height}px`,
                      border: `solid 3px ${
                        isActiveImg ? "#00ea9c" : "transparent"
                      }`,
                      transform: `rotate(${img.angle}deg)`,
                    }}
                    className={styles.image}
                  />
                  <svg
                    key={`annotation-list-${img.id}`}
                    className={styles.annotationList}
                    style={{
                      zIndex: isActiveImg ? 1 : 0,
                      width: `${img.width + imgMargin.width * 2}px`,
                      height: `${img.height + imgMargin.height * 2}px`,
                      transform: `rotate(${img.angle}deg)`,
                    }}
                  >
                    <Regions
                      dispatch={dispatch}
                      events={events}
                      imgMargin={imgMargin}
                      mousePositionRef={mousePositionRef}
                      zoomLvl={zoomLvl}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Workspace;

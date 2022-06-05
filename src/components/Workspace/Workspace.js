import useWindowSize from "../../hooks/useWindowSize";
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
  const windowSize = useWindowSize();

  const onImgLoad = (e) => {
    dispatch({
      type: "LOAD_IMAGE",
      id: e.target.id,
      w: e.target.naturalWidth,
      h: e.target.naturalHeight,
    });
  };

  const handleImgMouseDown = (e, idx) => {
    if (activeTool === "selectImage" && e.button === 0) {
      dispatch({ type: "SET_ACTIVE_IMAGE", idx: idx });
    } else if (
      activeTool === "moveImage" &&
      e.button === 0 &&
      activeImageIdx === idx
    ) {
      events.onMouseDown(e, null, true);
    }
  };

  return (
    <div
      className={styles.imgList}
      style={{
        ...windowSize,
        transform: `scale(${Math.max(Math.min(zoomLvl, 20), 0.5)})`,
      }}
      ref={imageContainerRef}
    >
      {images.map((img, imgIdx) => {
        const isActiveImg = activeImageIdx === imgIdx;
        const imgMargin = { width: 0.1 * img.width, height: 0.1 * img.height };
        return (
          <div
            key={`img-container-${img.id}`}
            className={styles.container}
            style={{
              minWidth: `${img.width}px`,
              minHeight: `${img.height}px`,
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
                style={{ zIndex: isActiveImg ? 1 : 0 }}
                className={styles.image}
              />
              <svg
                key={`annotation-list-${img.id}`}
                className={styles.annotationList}
                style={{
                  zIndex: isActiveImg ? 1 : 0,
                  width: `${img.width + imgMargin.width * 2}px`,
                  height: `${img.height + imgMargin.height * 2}px`,
                }}
              ></svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Workspace;

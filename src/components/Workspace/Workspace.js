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
    } else if (activeTool === "moveImage" && e.button === 0) {
      events.onMouseDown(e, null, true);
    }
  };

  return (
    <div className={styles.imgList} style={windowSize} ref={imageContainerRef}>
      {images.map((img, imgIdx) => {
        const isActiveImg = activeImageIdx === imgIdx;
        return (
          <div
            key={`img-container${img.id}`}
            onMouseDown={(e) => handleImgMouseDown(e, imgIdx)}
            className={styles.imgContainer}
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
                width: `${img.width}px`,
                height: `${img.height}px`,
              }}
            ></svg>
          </div>
        );
      })}
    </div>
  );
};

export default Workspace;

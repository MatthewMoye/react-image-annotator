import useWindowSize from "../../hooks/useWindowSize";
import styles from "./Workspace.module.css";

const Workspace = ({
  activeImageIdx,
  activeImageRef,
  activeTool,
  dispatch,
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

  const handleSelectImg = (e, idx) => {
    if (activeTool === "selectImage" && e.button === 0) {
      dispatch({ type: "SET_ACTIVE_IMAGE", idx: idx });
    }
  };

  return (
    <div className={styles.imgList} style={windowSize} ref={imageContainerRef}>
      {images.map((img, imgIdx) => {
        const annotationExtraSize = {
          width: img.width * 0.2,
          height: img.height * 0.2,
        };
        const isActiveImg = activeImageIdx === imgIdx;
        return (
          <div
            key={`img-container${img.id}`}
            onMouseDown={(e) => handleSelectImg(e, imgIdx)}
            className={styles.imgContainer}
            style={{
              zIndex: isActiveImg ? 2 : 1,
              margin: `${annotationExtraSize.height / 2}px ${
                annotationExtraSize.width / 2
              }px`,
            }}
            ref={isActiveImg ? activeImageRef : null}
          >
            <img
              key={`img-${img.id}`}
              id={img.id}
              src={img.src}
              alt={img.alt}
              onLoad={onImgLoad}
              style={{ zIndex: isActiveImg ? 2 : 1 }}
              className={styles.image}
            />
            <svg
              key={`annotation-list-${img.id}`}
              className={styles.annotationList}
              style={{
                zIndex: isActiveImg ? 2 : 1,
                width: `${img.width + annotationExtraSize.width}px`,
                height: `${img.height + annotationExtraSize.height}px`,
              }}
            ></svg>
          </div>
        );
      })}
    </div>
  );
};

export default Workspace;

import useWindowSize from "../../hooks/useWindowSize";
import styles from "./Workspace.module.css";

const Workspace = ({
  activeImageId,
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

  const onSelectImg = (e, id) => {
    if (activeTool === "selectImage" && e.button === 0) {
      dispatch({ type: "SET_ACTIVE_IMAGE", id: id });
    }
  };

  return (
    <div className={styles.imgList} style={windowSize} ref={imageContainerRef}>
      {images.map((img) => {
        const annotationExtraSize = {
          width: img.width * 0.2,
          height: img.height * 0.2,
        };
        return (
          <div
            key={`img-container${img.id}`}
            onMouseDown={(e) => onSelectImg(e, img.id)}
            className={styles.imgContainer}
            style={{
              margin: `${annotationExtraSize.height /2}px ${
                annotationExtraSize.width / 2
              }px`,
            }}
            ref={activeImageId === img.id ? activeImageRef : null}
          >
            <img
              key={`img-${img.id}`}
              id={img.id}
              src={img.src}
              alt={img.alt}
              onLoad={onImgLoad}
              className={styles.image}
            />
            <svg
              key={`annotation-list-${img.id}`}
              className={styles.annotationList}
              style={{
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

import useWindowSize from "../../hooks/useWindowSize";
import styles from "./Workspace.module.css";

const Workspace = (props) => {
  const windowSize = useWindowSize();

  const onImgLoad = (e) => {
    props.dispatch({
      type: "LOAD_IMAGE",
      id: e.target.id,
      w: e.target.naturalWidth,
      h: e.target.naturalHeight,
    });
  };

  const onSelectImg = (e, id) => {
    if (props.state.activeTool === "selectImage" && e.button === 0) {
      console.log(e.offsetTop);
      props.dispatch({ type: "SET_ACTIVE_IMAGE", id: id });
    }
  };

  return (
    <div
      className={styles.imgList}
      style={windowSize}
      ref={props.imageContainerRef}
    >
      {props.state.images.map((img) => {
        const imgSize = {
          width: `${img.width}px`,
          height: `${img.height}px`,
        };
        return (
          <div
            key={`img-container${img.id}`}
            onMouseDown={(e) => onSelectImg(e, img.id)}
            className={styles.imgContainer}
            style={imgSize}
            ref={
              props.state.activeImageId === img.id
                ? props.activeImageRef
                : null
            }
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
              style={imgSize}
            ></svg>
          </div>
        );
      })}
    </div>
  );
};

export default Workspace;

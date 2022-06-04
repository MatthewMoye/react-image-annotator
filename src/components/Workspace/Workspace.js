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

  const onSelectImg = (e) => {
    if (props.state.activeTool === "selectImage") {
      props.dispatch({ type: "SET_ACTIVE_IMAGE", id: e.target.id });
    }
  };

  return (
    <div
      className={styles.imgContainer}
      style={{
        width: windowSize.width,
        height: windowSize.height,
      }}
      ref={props.imageContainerRef}
    >
      {props.state.images.map((img) => (
        <img
          key={img.id}
          id={img.id}
          ref={props.imgRef}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          src={img.src}
          alt={"cool stuff"}
          onLoad={onImgLoad}
          onContextMenu={(e) => e.preventDefault()}
          className={styles.image}
        />
      ))}
    </div>
  );
};

export default Workspace;

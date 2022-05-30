import useWindowSize from "../../hooks/useWindowSize";
import Image from "../Layer/Image";
import styles from "./Workspace.module.css";

const Workspace = (props) => {
  const windowSize = useWindowSize();
  const onImgLoad = (e) => {
    props.dispatch({
      type: "IMAGE_LOAD",
      id: e.target.id,
      w: e.target.naturalWidth,
      h: e.target.naturalHeight,
    });
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
        <Image
          key={img.id}
          id={img.id}
          src={img.src}
          imgSetLength={props.state.images.length}
          onImgLoad={onImgLoad}
        />
      ))}
    </div>
  );
};

export default Workspace;

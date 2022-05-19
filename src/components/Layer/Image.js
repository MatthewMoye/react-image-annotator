import styles from "./Image.module.css";

const Image = (props) => {
  return (
    <img
      id={props.id}
      ref={props.imgRef}
      src={props.src}
      alt={"cool stuff"}
      onLoad={props.onImgLoad}
      onContextMenu={(e) => e.preventDefault()}
      className={styles.image}
    />
  );
};

export default Image;

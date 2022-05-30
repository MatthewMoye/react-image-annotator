import styles from "./Image.module.css";

const Image = (props) => {
  return (
    <img
      id={props.id}
      ref={props.imgRef}
      style={{ 
        width: "100%",
        height: "100%",
        objectFit: "contain"
       }}
      src={props.src}
      alt={"cool stuff"}
      onLoad={props.onImgLoad}
      onContextMenu={(e) => e.preventDefault()}
      className={styles.image}
    />
  );
};

export default Image;

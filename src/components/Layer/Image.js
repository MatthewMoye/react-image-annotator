import styles from "./Image.module.css";

const Image = (props) => {
  return (
    <img
      id={123}
      ref={props.imgRef}
      src={"https://jw-webmagazine.com/wp-content/uploads/2020/03/Kimetsu-no-YaibaDemon-Slayer.jpg"}
      alt={"cool stuff"}
      onLoad={props.onImgLoad}
      onContextMenu={(e) => e.preventDefault()}
      className={styles.image}
      width={1000}
      height={1000}
    />
  );
};

export default Image;

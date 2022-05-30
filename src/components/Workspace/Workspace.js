import { useState } from "react";
import Image from "../Layer/Image";
import styles from "./Workspace.module.css";

const Workspace = (props) => {
  const [imgData, setimgData] = useState([]);

  const onImgLoad = (e) => {
    setimgData([
      ...imgData,
      {
        id: e.target.key,
        w: e.target.naturalWidth,
        h: e.target.naturalHeight,
      },
    ]);
  };
  console.log(props.state.images);
  return (
    <div
      className={styles.imgContainer}
      style={{
        display: imgData.length > 0 ? "flex" : "none",
        width: "1000px",
        height: "1000px",
      }}
      ref={props.imageContainerRef}
    >
      {props.state.images.map((img) => (
        <Image key={img.id} src={img.src} onImgLoad={onImgLoad} />
      ))}
    </div>
  );
};

export default Workspace;

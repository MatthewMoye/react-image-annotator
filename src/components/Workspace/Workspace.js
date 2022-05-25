import { useRef, useState } from "react";
import Image from "../Layer/Image";
import styles from "./Workspace.module.css";

const tempImg =
  "https://jw-webmagazine.com/wp-content/uploads/2020/03/Kimetsu-no-YaibaDemon-Slayer.jpg";

const Workspace = (props) => {
  const [containerPos, setContainerPos] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState(false);
  const [imgData, setimgData] = useState([]);

  const imgRef1 = useRef();
  const imgRef2 = useRef();
  const imgContainerRef = useRef();

  const startPanning = (e) => {
    if (e.button !== 2) return;
    setPan(true);
  };

  const updatePosition = (e) => {
    const moveX =
      props.mousePos.x - (e.pageX - imgContainerRef.current.offsetLeft);
    const moveY =
      props.mousePos.y - (e.pageY - imgContainerRef.current.offsetTop);
    if (pan) {
      setContainerPos({ x: containerPos.x - moveX, y: containerPos.y - moveY });
    }
  };

  const stopPanning = (e) => {
    if (e.button !== 2) return;
    setPan(false);
  };

  const onImgLoad = (e) => {
    // make sure this works with varying zoom lvls
    setimgData([
      ...imgData,
      [
        {
          id: e.target.id,
          w: e.target.naturalWidth,
          h: e.target.naturalHeight,
        },
      ],
    ]);
  };

  return (
    <div
      className={styles.imgContainer}
      style={{
        top: `${containerPos.y}px`,
        left: `${containerPos.x}px`,
        display:
          imgRef1.current?.value && imgRef2.current?.value ? "none" : "flex",
        width:
          "1000px" /* make sure image children fit in width (keep zoom in mind) */,
        height:
          "1000px" /* make sure image children fit in height (keep zoom in mind) */,
      }}
      ref={imgContainerRef}
    >
      <Image id={11} imgRef={imgRef1} src={tempImg} onImgLoad={onImgLoad} />
      <Image id={22} imgRef={imgRef2} src={tempImg} onImgLoad={onImgLoad} />
    </div>
  );
};

export default Workspace;

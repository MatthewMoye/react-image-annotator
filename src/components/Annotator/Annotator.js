import { useRef, useState } from "react";
import Image from "../Layer/Image";
import styles from "./Annotator.module.css";

const tempImg =
  "https://jw-webmagazine.com/wp-content/uploads/2020/03/Kimetsu-no-YaibaDemon-Slayer.jpg";

const Annotator = () => {
  const [mousePos, setmousePos] = useState({ x: 0, y: 0 });
  const [containerPos, setContainerPos] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState(false);
  const [imgData, setimgData] = useState([]);

  const imgRef = useRef();
  const containerRef = useRef();

  const enablePanning = (e) => {
    if (e.button !== 2) return;
    setmousePos({
      x: e.pageX - containerRef.current.offsetLeft,
      y: e.pageY - containerRef.current.offsetTop,
    });
    setPan(true);
  };

  const updatePosition = (e) => {
    if (pan) {
      const moveX = mousePos.x - (e.pageX - containerRef.current.offsetLeft);
      const moveY = mousePos.y - (e.pageY - containerRef.current.offsetTop);
      setContainerPos({ x: containerPos.x - moveX, y: containerPos.y - moveY });
    }
  };

  const disablePanning = (e) => {
    if (e.button !== 2) return;
    setPan(false);
  };

  const onImgLoad = (e) => {
    // make sure this works with varying zoom lvls
    setimgData([
      ...imgData,
      { id: e.target.id, w: e.target.offsetWidth, h: e.target.offsetHeight },
    ]);
  };

  return (
    <div
      className={styles.annotatorContainer}
      onMouseDown={enablePanning}
      onMouseMove={updatePosition}
      onMouseUp={disablePanning}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={styles.imgContainer}
        style={{
          top: `${containerPos.y}px`,
          left: `${containerPos.x}px`,
          width:
            "1000px" /* make sure image children fit in width (keep zoom in mind) */,
          height:
            "1000px" /* make sure image children fit in height (keep zoom in mind) */,
        }}
        ref={containerRef}
      >
        <Image id={11} imgRef={imgRef} src={tempImg} onImgLoad={onImgLoad} />
        <Image id={22} imgRef={imgRef} src={tempImg} onImgLoad={onImgLoad} />
      </div>
      {mousePos.x}
    </div>
  );
};

export default Annotator;

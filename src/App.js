import "./App.css";
import Image from "./components/Layer/Image";
import { useRef, useState } from "react";

const App = () => {
  const [mousePos, setmousePos] = useState({ x: 0, y: 0 });
  const [containerPos, setContainerPos] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState(false);
  const [imgData, setimgData] = useState([]);

  const imgRef = useRef();
  const containerRef = useRef();

  const getPos = (e, ref) => {
    if (e.button !== 2) return;
    setPan(true);
    // get mousePosition regardless of zoom level or page position for current image
    setmousePos({
      x: e.pageX - ref.current.offsetLeft,
      y: e.pageY - ref.current.offsetTop,
    });
  };

  const updatePosition = (e, ref) => {
    const moveX = mousePos.x - (e.pageX - ref.current.offsetLeft);
    const moveY = mousePos.y - (e.pageY - ref.current.offsetTop);
    if (pan) {
      getPos(e, ref);
      setContainerPos({ x: containerPos.x - moveX, y: containerPos.y - moveY });
    }
  };

  const stopMovingPosition = () => {
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
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        maxWidth: "100%",
        maxHeight: "100%",
        overflow: "hidden",
      }}
    >
      <div
        onMouseDown={(e) => getPos(e, containerRef)}
        onMouseMove={(e) => updatePosition(e, containerRef)}
        onMouseUp={stopMovingPosition}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${containerPos.y}px`,
            left: `${containerPos.x}px`,
          }}
          ref={containerRef}
        >
          <Image imgRef={imgRef} onImgLoad={onImgLoad} />
        </div>
        {/* {mousePos.x} */}
      </div>
    </div>
  );
};

export default App;

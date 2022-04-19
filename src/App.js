import "./App.css";
import Image from "./components/Layer/Image";
import { useRef, useState } from "react";

const App = () => {
  const [mousePos, setmousePos] = useState({ x: 0, y: 0 });
  const [imgData, setimgData] = useState([]);

  const imgRef = useRef();

  const getPos = (e) => {
    // get mousePosition regardless of zoom level or page position for current image
    setmousePos({
      x: e.pageX - imgRef.current.offsetLeft,
      y: e.pageY - imgRef.current.offsetTop,
    });
  };

  const onImgLoad = (e) => {
    // make sure this works with varying zoom lvls
    setimgData([
      ...imgData,
      { id: e.target.id, w: e.target.offsetWidth, h: e.target.offsetHeight },
    ]);
  };

  return (
    <>
      <div className="App" onMouseMove={getPos}>
        <Image imgRef={imgRef} onImgLoad={onImgLoad} />
      </div>
      {mousePos.x}
    </>
  );
};

export default App;

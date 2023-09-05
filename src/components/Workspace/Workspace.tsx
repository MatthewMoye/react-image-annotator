import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "reduxHooks";
import { setZoom } from "features/toolSlice/toolSlice";
import Regions from "../Regions/Regions";
import useEvents from "./useEvents";
import styles from "./Workspace.module.css";
import Image from "components/Image/Image";

const Workspace = () => {
  const dispatch = useAppDispatch();
  const { zoomLvl } = useAppSelector((state) => state.tool);
  const { images, totalImageSize } = useAppSelector((state) => state.image);

  const activeImageRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line
  const { mousePosRef, events } = useEvents(activeImageRef, imageContainerRef);

  useEffect(() => {
    const newZoom = Math.min(
      window.innerWidth / totalImageSize.width,
      window.innerHeight / totalImageSize.height
    );
    dispatch(setZoom(newZoom));
  }, [dispatch, totalImageSize]);

  return (
    <div
      className={styles.workspaceContainer}
      onMouseMove={events.onMouseMove}
      onMouseDown={events.onMouseDown}
      onMouseUp={events.onMouseUp}
      onMouseLeave={events.onMouseLeave}
      onWheel={events.onWheel}
      onContextMenu={events.onContextMenu}
    >
      <div
        className={styles.imgListContainer}
        style={{
          transform: `scale(${zoomLvl})`,
          msTransform: `scale(${zoomLvl})`,
          WebkitTransform: `scale(${zoomLvl})`,
        }}
      >
        <div className={styles.imgList} ref={imageContainerRef}>
          {images.map((img, imgIdx) => {
            const imgMargin = {
              width: 0.1 * img.width,
              height: 0.1 * img.height,
            };
            return (
              <Image
                key={`image-${img.id}`}
                activeImageRef={activeImageRef}
                events={events}
                img={img}
                imgIdx={imgIdx}
                imgMargin={imgMargin}
              >
                <Regions events={events} img={img} imgMargin={imgMargin} />
              </Image>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Workspace;

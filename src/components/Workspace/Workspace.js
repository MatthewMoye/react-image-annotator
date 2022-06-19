import { useRef } from "react";
import Regions from "../Regions/Regions";
import useEvents from "./useEvents";
import styles from "./Workspace.module.css";

const Workspace = ({
  activeImageIdx,
  activeRegionId,
  activeTool,
  dispatch,
  images,
  isPanning,
  isMovingImg,
  zoomLvl,
}) => {
  const activeImageAngle = images[activeImageIdx]?.angle;
  const activeImageRef = useRef();
  const imageContainerRef = useRef();

  // eslint-disable-next-line
  const [mousePositionRef, events] = useEvents(
    activeImageAngle,
    activeImageRef,
    activeTool,
    dispatch,
    imageContainerRef,
    isMovingImg,
    isPanning,
    zoomLvl
  );

  const onImgLoad = (e, regions) => {
    dispatch({
      type: "LOAD_IMAGE",
      id: e.target.id,
      w: e.target.naturalWidth,
      h: e.target.naturalHeight,
      regions: regions,
    });
  };

  const handleImgMouseDown = (e, idx) => {
    if (e.button !== 0) return;
    if (activeTool === "selectImage") {
      dispatch({ type: "SET_ACTIVE_IMAGE", idx: idx });
    } else if (activeTool === "rotate" && activeImageIdx === idx) {
      dispatch({ type: "ROTATE_IMAGE" });
    } else if (activeTool === "moveImage" && activeImageIdx === idx) {
      events.onMouseDown(e, null, null, true);
    }
  };

  return (
    <div className={styles.workspaceContainer} {...events}>
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
            const isActiveImg = activeImageIdx === imgIdx;
            const imgMargin = {
              width: 0.1 * img.width,
              height: 0.1 * img.height,
            };
            return (
              <div
                key={`img-container-${img.id}`}
                className={styles.imgContainer}
                style={{
                  minWidth: `${Math.max(img.width, img.height)}px`,
                  minHeight: `${Math.max(img.width, img.height)}px`,
                  margin: `${imgMargin.height}px ${imgMargin.width}px`,
                  zIndex: isActiveImg ? 1 : 0,
                }}
              >
                <div
                  key={`img-box-${img.id}`}
                  className={styles.imgBox}
                  style={{
                    width: `${img.width}px`,
                    height: `${img.height}px`,
                  }}
                  ref={isActiveImg ? activeImageRef : null}
                >
                  <div
                    key={`img-area-${img.id}`}
                    onMouseDown={(e) => handleImgMouseDown(e, imgIdx)}
                    className={styles.imgArea}
                    style={{
                      border: `solid 3px ${
                        isActiveImg ? "#00ea9c" : "transparent"
                      }`,
                      transform: `rotate(${img.angle}deg)`,
                    }}
                  >
                    <img
                      key={`img-${img.id}`}
                      id={img.id}
                      src={img.src}
                      alt={img.alt}
                      onLoad={(e) => onImgLoad(e, img.regions)}
                      style={{
                        width: `${img.width}px`,
                        height: `${img.height}px`,
                      }}
                      className={styles.img}
                    />
                    {img.regions && (
                      <Regions
                        activeRegionId={activeRegionId}
                        activeTool={activeTool}
                        dispatch={dispatch}
                        events={events}
                        img={img}
                        imgMargin={imgMargin}
                        isActiveImg={isActiveImg}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Workspace;

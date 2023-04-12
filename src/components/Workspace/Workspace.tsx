import { Dispatch, MouseEvent, useEffect, useRef } from "react";
import Regions from "../Regions/Regions";
import useEvents from "./useEvents";
import { Image } from "types/image";
import { Mode } from "types/mode";
import styles from "./Workspace.module.css";
import { Region } from "types/region";

type WorkspaceProps = {
  activeImageIdx: number;
  activeRegionId: string;
  activeRegionType: string;
  activeTool: string;
  dispatch: Dispatch<any>;
  images: Image[];
  isPanning: boolean;
  isMovingImg: boolean;
  mode: Mode;
  totalImageSize: { width: number; height: number };
  workspaceLoaded: boolean;
  zoomLvl: number;
};

const Workspace = ({
  activeImageIdx,
  activeRegionId,
  activeRegionType,
  activeTool,
  dispatch,
  images,
  isPanning,
  isMovingImg,
  mode,
  totalImageSize,
  workspaceLoaded,
  zoomLvl,
}: WorkspaceProps) => {
  const activeImageAngle = images[activeImageIdx].angle;
  const activeImageRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line
  const { mousePosRef, events } = useEvents(
    activeImageAngle,
    activeImageRef,
    activeRegionType,
    activeTool,
    dispatch,
    imageContainerRef,
    isMovingImg,
    isPanning,
    mode,
    zoomLvl
  );

  const onImgLoad = (
    e: React.SyntheticEvent<HTMLImageElement>,
    regions: Region[],
    imgIdx: number
  ) => {
    const img = e.target as HTMLImageElement;
    dispatch({
      type: "IMAGE",
      event: "LOAD",
      idx: imgIdx,
      w: img.naturalWidth,
      h: img.naturalHeight,
      regions: regions,
    });
  };

  const handleImgMouseDown = (e: MouseEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (e.button !== 0) return;
    if (activeTool === "selectImage") {
      dispatch({ type: "IMAGE", event: "SET_ACTIVE", idx: idx });
    } else if (activeTool === "rotate" && activeImageIdx === idx) {
      dispatch({ type: "IMAGE", event: "ROTATE" });
    } else if (activeTool === "moveImage" && activeImageIdx === idx) {
      e.stopPropagation();
      events.onMouseDown(e, "MOVE_IMAGE");
    }
  };

  useEffect(() => {
    dispatch({
      type: "DEFAULT_ZOOM",
      zoomLvl: Math.min(
        window.innerWidth / totalImageSize.width,
        window.innerHeight / totalImageSize.height
      ),
    });
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
                  display: workspaceLoaded ? "flex" : "none",
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
                  ref={isActiveImg ? activeImageRef : undefined}
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
                      onLoad={(e) => onImgLoad(e, img.regions, imgIdx)}
                      style={{
                        width: `${img.width}px`,
                        height: `${img.height}px`,
                      }}
                      className={styles.img}
                    />
                    {workspaceLoaded && img.regions && (
                      <Regions
                        activeRegionId={activeRegionId}
                        activeTool={activeTool}
                        dispatch={dispatch}
                        events={events}
                        img={img}
                        imgMargin={imgMargin}
                        zoomLvl={zoomLvl}
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

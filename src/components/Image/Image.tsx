import { MouseEvent, PropsWithChildren, RefObject } from "react";
import { useAppDispatch, useAppSelector } from "reduxHooks";
import { loadImage, setActiveImageIdx } from "features/imageSlice/imageSlice";
import { Image, ImageMargin } from "types/image";
import { CustomEvents } from "components/Workspace/useEvents";
import styles from "./Image.module.css";

interface ImageProps {
  activeImageRef: RefObject<HTMLDivElement>;
  events: CustomEvents;
  img: Image;
  imgIdx: number;
  imgMargin: ImageMargin;
}

const Image = ({
  children,
  activeImageRef,
  events,
  img,
  imgIdx,
  imgMargin,
}: PropsWithChildren<ImageProps>) => {
  const dispatch = useAppDispatch();
  const { activeTool, zoomLvl } = useAppSelector((state) => state.tool);
  const { activeImageIdx, totalImageSize } = useAppSelector(
    (state) => state.image
  );

  const onImgLoad = (
    e: React.SyntheticEvent<HTMLImageElement>,
    imgIdx: number
  ) => {
    const img = e.target as HTMLImageElement;
    dispatch(loadImage(imgIdx, img.naturalWidth, img.naturalHeight));
  };

  const handleImgMouseDown = (e: MouseEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (e.button !== 0) return;
    if (activeTool === "selectImage") {
      dispatch(setActiveImageIdx(idx));
    } else if (activeTool === "moveImage" && activeImageIdx === idx) {
      e.stopPropagation();
      events.onMouseDown(e, "MOVE_IMAGE");
    }
  };

  const isActiveImg = activeImageIdx === imgIdx;
  const workspaceLoaded = totalImageSize.width > 0 && totalImageSize.height > 0;

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
            border: `solid ${2 / zoomLvl}px ${
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
            onLoad={(e) => onImgLoad(e, imgIdx)}
            style={{
              width: `${img.width}px`,
              height: `${img.height}px`,
            }}
            className={styles.img}
          />
          {workspaceLoaded && <>{children}</>}
        </div>
      </div>
    </div>
  );
};

export default Image;

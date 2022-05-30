import { useReducer, useRef } from "react";
import Toolbar from "../Toolbar/Toolbar";
import Workspace from "../Workspace/Workspace";
import reducer from "./reducer";
import useEvents from "./user-events";
import styles from "./Annotator.module.css";

const tempImg =
  "https://c2.peakpx.com/wallpaper/98/334/470/4k-aerial-view-city-cityscape-drone-wallpaper-preview.jpg";

const Annotator = () => {
  const [state, dispatch] = useReducer(reducer, {
    images: [
      { id: 1, src: tempImg },
      { id: 2, src: tempImg },
    ],
    activeTool: "moveImage",
  });

  const activeImageRef = useRef();
  const imageContainerRef = useRef();

  const [mousePosition, events] = useEvents(
    dispatch,
    activeImageRef,
    imageContainerRef,
    state.activeTool
  );

  return (
    <>
      <div className={styles.annotatorContainer} {...events}>
        <Workspace
          state={state}
          dispatch={dispatch}
          activeImageRef={activeImageRef}
          imageContainerRef={imageContainerRef}
          mousePosition={mousePosition}
          events={events}
        />
      </div>
      <Toolbar />
    </>
  );
};

export default Annotator;

import { useReducer, useRef } from "react";
import Toolbar from "../Toolbar/Toolbar";
import Workspace from "../Workspace/Workspace";
import reducer from "./reducer/reducer";
import useEvents from "./useEvents";
import styles from "./Annotator.module.css";

const tempImg1 =
  "https://c2.peakpx.com/wallpaper/98/334/470/4k-aerial-view-city-cityscape-drone-wallpaper-preview.jpg";
const tempImg2 =
  "https://images.unsplash.com/photo-1502899576159-f224dc2349fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80";

const Annotator = () => {
  const [state, dispatch] = useReducer(reducer, {
    images: [
      { id: 1, src: tempImg1 },
      { id: 2, src: tempImg2 },
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
      <Toolbar dispatch={dispatch} activeTool={state.activeTool} />
    </>
  );
};

export default Annotator;

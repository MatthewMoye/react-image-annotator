import { useReducer, useRef } from "react";
import Toolbar from "../Toolbar/Toolbar";
import Workspace from "../Workspace/Workspace";
import reducer from "./reducer/reducer";
import useEvents from "./useEvents";
import { imagesData } from "./imagesData";

const Annotator = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    activeImageIdx: 0,
    activeTool: "select",
    images: imagesData,
    zoomLvl: 1,
  });

  const activeImageRef = useRef();
  const imageContainerRef = useRef();

  const [mousePositionRef, events] = useEvents(
    dispatch,
    activeImageRef,
    imageContainerRef,
    state.activeTool
  );

  return (
    <>
      <Workspace
        activeImageIdx={state.activeImageIdx}
        activeImageRef={activeImageRef}
        activeTool={state.activeTool}
        dispatch={dispatch}
        events={events}
        imageContainerRef={imageContainerRef}
        images={state.images}
        mousePositionRef={mousePositionRef}
        zoomLvl={state.zoomLvl}
      />
      <Toolbar dispatch={dispatch} activeTool={state.activeTool} />
    </>
  );
};

export default Annotator;

import { useReducer, useRef } from "react";
import Toolbar from "../Toolbar/Toolbar";
import Workspace from "../Workspace/Workspace";
import reducer from "./reducers/reducer";
import useEvents from "./useEvents";

const Annotator = ({ images }) => {
  const [state, dispatch] = useReducer(reducer, {
    activeImageIdx: 0,
    activeTool: "select",
    images: images,
    isPanning: false,
    isMovingImg: false,
    zoomLvl: 1,
  });

  const activeImageRef = useRef();
  const imageContainerRef = useRef();

  const [mousePositionRef, events] = useEvents(
    dispatch,
    activeImageRef,
    state.activeTool,
    imageContainerRef,
    state.isMovingImg,
    state.isPanning,
    state.zoomLvl
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
        workspaceAngle={state.workspaceAngle}
        zoomLvl={state.zoomLvl}
      />
      <Toolbar dispatch={dispatch} activeTool={state.activeTool} />
    </>
  );
};

export default Annotator;

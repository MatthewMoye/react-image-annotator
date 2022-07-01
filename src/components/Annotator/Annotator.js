import { useReducer } from "react";
import makeImmutable from "seamless-immutable";
import Toolbar from "../Toolbar/Toolbar";
import Workspace from "../Workspace/Workspace";
import reducer from "./reducers/reducer";

const Annotator = ({ images }) => {
  const [state, dispatch] = useReducer(
    reducer,
    makeImmutable({
      activeImageIdx: 0,
      activeRegionId: null,
      activeRegionType: null,
      activeTool: "select",
      images: images,
      isPanning: false,
      isMovingImg: false,
      mode: {},
      zoomLvl: 1,
    })
  );

  return (
    <>
      <Workspace
        activeImageIdx={state.activeImageIdx}
        activeRegionId={state.activeRegionId}
        activeRegionType={state.activeRegionType}
        activeTool={state.activeTool}
        dispatch={dispatch}
        images={state.images}
        isMovingImg={state.isMovingImg}
        isPanning={state.isPanning}
        zoomLvl={state.zoomLvl}
      />
      <Toolbar dispatch={dispatch} activeTool={state.activeTool} />
    </>
  );
};

export default Annotator;

import { useReducer } from "react";
import makeImmutable from "seamless-immutable";
import { UploadedImage } from "types/image";
import Toolbar from "../Toolbar/Toolbar";
import Workspace from "../Workspace/Workspace";
import reducer from "./reducers/reducer";

type AnnotatorProps = {
  images: UploadedImage[];
};

const Annotator = ({ images }: AnnotatorProps) => {
  const [state, dispatch] = useReducer(
    reducer,
    makeImmutable({
      activeImageIdx: 0,
      activeRegionId: null,
      activeRegionType: null,
      images: images.map((img) => ({
        ...img,
        angle: 0,
        width: 0,
        height: 0,
        regions: [],
      })),
      mode: {},
      totalImageSize: { width: 0, height: 0 },
    })
  );

  return (
    <>
      <Workspace
        activeImageIdx={state.activeImageIdx}
        activeRegionId={state.activeRegionId}
        activeRegionType={state.activeRegionType}
        dispatch={dispatch}
        images={state.images}
        mode={state.mode}
        totalImageSize={state.totalImageSize}
      />
      <Toolbar />
    </>
  );
};

export default Annotator;

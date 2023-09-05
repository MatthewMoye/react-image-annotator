import { useEffect } from "react";
import { UploadedImage } from "types/image";
import { setImageList } from "features/imageSlice/imageSlice";
import { useAppDispatch } from "reduxHooks";
import Toolbar from "../Toolbar/Toolbar";
import Workspace from "../Workspace/Workspace";

type AnnotatorProps = {
  images: UploadedImage[];
};

const Annotator = ({ images }: AnnotatorProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setImageList(images));
  }, []);

  return (
    <>
      <Workspace />
      <Toolbar />
    </>
  );
};

export default Annotator;

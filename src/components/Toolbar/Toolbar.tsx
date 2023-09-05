import { useAppDispatch, useAppSelector } from "reduxHooks";
import {
  BurstMode,
  CropSquare,
  Image,
  LocationSearching,
  PanTool,
  PanToolAlt,
  Rotate90DegreesCw,
} from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";
import styles from "./Toolbar.module.css";
import { setTool } from "features/toolSlice/toolSlice";
import { rotateImage } from "features/imageSlice/imageSlice";

export const toolIconList = {
  select: (cls: SvgIconProps) => (
    <PanToolAlt {...cls} sx={{ fontSize: "48px" }} />
  ),
  pan: (cls: SvgIconProps) => <PanTool {...cls} sx={{ fontSize: "36px" }} />,
  createPoint: (cls: SvgIconProps) => (
    <LocationSearching {...cls} sx={{ fontSize: "36px" }} />
  ),
  createBox: (cls: SvgIconProps) => (
    <CropSquare {...cls} sx={{ fontSize: "48px" }} />
  ),
  selectImage: (cls: SvgIconProps) => (
    <Image {...cls} sx={{ fontSize: "48px" }} />
  ),
  moveImage: (cls: SvgIconProps) => (
    <BurstMode {...cls} sx={{ fontSize: "48px" }} />
  ),
  rotate: (cls: SvgIconProps) => (
    <Rotate90DegreesCw {...cls} sx={{ fontSize: "48px" }} />
  ),
};

const Toolbar = () => {
  const dispatch = useAppDispatch();
  const { activeTool } = useAppSelector((state) => state.tool);

  const isActiveTool = (toolName: string) =>
    `toolIcon${activeTool === toolName ? "Active" : ""}`;
  const updateTool = (tool: string) => {
    if (tool === "rotate") dispatch(rotateImage());
    else dispatch(setTool(tool as keyof typeof toolIconList));
  };

  return (
    <div className={styles.container} onContextMenu={(e) => e.preventDefault()}>
      {Object.keys(toolIconList).map((tool) => {
        const ToolIcon = toolIconList[tool as keyof typeof toolIconList];
        return (
          <ToolIcon
            key={`${tool}-tool`}
            className={styles[isActiveTool(tool)]}
            onClick={() => updateTool(tool)}
          />
        );
      })}
    </div>
  );
};

export default Toolbar;

import { Dispatch } from "react";
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

type ToolbarProps = {
  activeTool: string;
  dispatch: Dispatch<any>;
};

const Toolbar = ({ activeTool, dispatch }: ToolbarProps) => {
  const toolIconList = {
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

  const isActiveTool = (toolName: string) =>
    `toolIcon${activeTool === toolName ? "Active" : ""}`;
  const updateTool = (tool: string) =>
    dispatch({ type: "SET_TOOL", tool: tool });

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

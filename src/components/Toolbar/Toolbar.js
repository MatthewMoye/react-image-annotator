import {
  BurstMode,
  CropSquare,
  Image,
  LocationSearching,
  PanTool,
  PanToolAlt,
  Rotate90DegreesCw,
} from "@mui/icons-material";
import styles from "./Toolbar.module.css";

const Toolbar = (props) => {
  const toolIconList = {
    select: (obj) => <PanToolAlt {...obj} sx={{ fontSize: "48px" }} />,
    pan: (obj) => <PanTool {...obj} sx={{ fontSize: "36px" }} />,
    createPoint: (obj) => <LocationSearching {...obj} sx={{ fontSize: "36px" }} />,
    createBox: (obj) => <CropSquare {...obj} sx={{ fontSize: "48px" }} />,
    selectImage: (obj) => <Image {...obj} sx={{ fontSize: "48px" }} />,
    moveImage: (obj) => <BurstMode {...obj} sx={{ fontSize: "48px" }} />,
    rotate: (obj) => <Rotate90DegreesCw {...obj} sx={{ fontSize: "48px" }} />,
  };

  const isActiveTool = (toolName) =>
    `toolIcon${props.activeTool === toolName ? "Active" : ""}`;
  const updateTool = (tool) => props.dispatch({ type: "SET_TOOL", tool: tool });

  return (
    <div className={styles.container} onContextMenu={(e) => e.preventDefault()}>
      {Object.keys(toolIconList).map((tool) => {
        const ToolIcon = toolIconList[tool];
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

import {
  CropSquare,
  LocationSearching,
  PanTool,
  PanToolAlt,
} from "@mui/icons-material";
import styles from "./Toolbar.module.css";

const Toolbar = (props) => {
  const toolIcons = {
    select: (obj) => <PanToolAlt {...obj} sx={{ fontSize: "48px" }} />,
    pan: (obj) => <PanTool {...obj} sx={{ fontSize: "36px" }} />,
    point: (obj) => <LocationSearching {...obj} sx={{ fontSize: "36px" }} />,
    box: (obj) => <CropSquare {...obj} sx={{ fontSize: "48px" }} />,
  };
  const toolList = ["select", "pan", "point", "box"];

  const isActiveTool = (toolName) =>
    `toolIcon${props.activeTool === toolName ? "Active" : ""}`;
  const updateTool = (tool) =>
    props.dispatch({ type: "UPDATE_TOOL", tool: tool });

  return (
    <div className={styles.container} onContextMenu={(e) => e.preventDefault()}>
      {toolList.map((tool) => {
        const ToolComponent = toolIcons[tool];
        return (
          <ToolComponent
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

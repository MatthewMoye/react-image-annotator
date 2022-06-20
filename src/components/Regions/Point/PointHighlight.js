import { useState } from "react";

const PointHighlight = ({ activeRegionId, dispatch, img, imgMargin, r }) => {
  const [isHovering, setIsHovering] = useState(false);
  const isActive = activeRegionId === r.id;

  const handleRegionSelect = (e) => {
    dispatch({ type: "SELECT_REGION", regionId: r.id });
    e.stopPropagation();
  };

  const toggleHover = () => {
    setIsHovering(!isHovering);
  };

  const xPos = r.points[0][0] * img.width + imgMargin.width;
  const yPos = r.points[0][1] * img.height + imgMargin.height;

  return (
    <div
      style={{
        position: "absolute",
        top: yPos - 14,
        left: xPos - 14,
        width: "27px",
        height: "27px",
        outline: isActive || isHovering ? "2px dotted white" : null,
        "&hover": { outline: "2px dotted white" },
      }}
      onMouseDown={handleRegionSelect}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    />
  );
};

export default PointHighlight;

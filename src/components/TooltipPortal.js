// components/TooltipPortal.js
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const TooltipPortal = ({ children, position }) => {
  const [tooltipContainer, setTooltipContainer] = useState(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = `${position.top}px`;
    container.style.left = `${position.left}px`;
    container.style.zIndex = 9999;
    document.body.appendChild(container);
    setTooltipContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, [position]);

  return tooltipContainer ? createPortal(children, tooltipContainer) : null;
};

export default TooltipPortal;

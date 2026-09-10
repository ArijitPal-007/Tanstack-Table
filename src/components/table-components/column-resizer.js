import React from "react";
export function ColumnResizer({ header }) {
    const column = header.column;
    if (!column.getCanResize()) {
        return null;
    }
    return (React.createElement("div", { role: "separator", "aria-orientation": "vertical", onMouseDown: (event) => {
            event.stopPropagation();
            header.getResizeHandler()(event);
        }, onTouchStart: (event) => {
            event.stopPropagation();
            header.getResizeHandler()(event);
        }, onDoubleClick: (event) => {
            event.stopPropagation();
            column.resetSize();
        }, className: [
            "absolute inset-y-0 right-0 z-30 w-2",
            "cursor-col-resize select-none touch-none",
            "hover:bg-primary/50",
            column.getIsResizing()
                ? "bg-primary"
                : "",
        ].join(" ") }));
}

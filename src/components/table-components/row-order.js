import { GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import React from "react";
export function RowOrderHandle({ row, table, }) {
    const handleDragStart = (event) => {
        event.stopPropagation();
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("row-id", row.id);
        event.dataTransfer.setData("text/plain", row.id);
        table.options.meta?.setDraggingRowId?.(row.id);
    };
    const handleDragEnd = () => {
        table.options.meta?.setDraggingRowId?.(null);
    };
    return (React.createElement(Button, { type: "button", draggable: true, onDragStart: handleDragStart, onDragEnd: handleDragEnd, onClick: (event) => event.stopPropagation(), className: "inline-flex cursor-grab items-center justify-center rounded p-1 opacity-50 hover:bg-muted hover:opacity-100 active:cursor-grabbing", title: "Drag to reorder row" },
        React.createElement(GripVertical, { className: "size-4" })));
}

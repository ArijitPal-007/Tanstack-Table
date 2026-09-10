import { GripVertical } from "lucide-react";
import React from "react";
export function ColumnOrderHandle({ column, }) {
    //   if (!column.getCanReorder()) {
    //     return null
    //   }
    return (React.createElement("span", { draggable: true, onDragStart: (event) => {
            event.stopPropagation();
            event.dataTransfer.effectAllowed = "copyMove";
            // Used by column ordering
            event.dataTransfer.setData("column-id", column.id);
            // Used by grouping
            event.dataTransfer.setData("text/plain", column.id);
        }, onDragEnd: (event) => {
            event.stopPropagation();
        }, className: "inline-flex cursor-grab touch-none items-center rounded p-0.5 opacity-50 hover:bg-white/10 hover:opacity-100 active:cursor-grabbing", title: "Drag to reorder or group column" },
        React.createElement(GripVertical, { className: "size-4" })));
}
export function handleColumnDrop(event, targetColumnId, table) {
    event.preventDefault();
    event.stopPropagation();
    const draggedColumnId = event.dataTransfer.getData("column-id");
    if (!draggedColumnId ||
        draggedColumnId === targetColumnId) {
        return;
    }
    table.setColumnOrder((previousOrder) => {
        const currentOrder = previousOrder.length > 0
            ? [...previousOrder]
            : table
                .getAllLeafColumns()
                .map((column) => column.id);
        const oldIndex = currentOrder.indexOf(draggedColumnId);
        const newIndex = currentOrder.indexOf(targetColumnId);
        if (oldIndex === -1 || newIndex === -1) {
            return currentOrder;
        }
        const [movedColumn] = currentOrder.splice(oldIndex, 1);
        currentOrder.splice(newIndex, 0, movedColumn);
        return currentOrder;
    });
}

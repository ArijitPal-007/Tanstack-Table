import { X, Layers3 } from "lucide-react";
import React from "react";
export function GroupingDropZone({ table }) {
    const grouping = table.state.grouping;
    function addGrouping(columnId) {
        if (!columnId)
            return;
        const column = table.getColumn(columnId);
        if (!column)
            return;
        if (!column.getCanGroup()) {
            return;
        }
        if (grouping.includes(columnId)) {
            return;
        }
        table.setGrouping((old) => [
            ...old,
            columnId,
        ]);
    }
    function removeGrouping(columnId) {
        table.setGrouping((old) => old.filter((id) => id !== columnId));
    }
    return (React.createElement("div", { onDragOver: (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = "move";
        }, onDrop: (event) => {
            event.preventDefault();
            event.stopPropagation();
            const columnId = event.dataTransfer.getData("column-id") ||
                event.dataTransfer.getData("text/plain");
            addGrouping(columnId);
        }, className: "flex  w-full flex-wrap items-center gap-2 rounded-lg border border-dashed bg-muted/30 p-3 transition-colors hover:border-primary hover:bg-primary/5" },
        React.createElement("div", { className: "flex items-center gap-2 text-sm text-muted-foreground" },
            React.createElement(Layers3, { className: "size-4" }),
            grouping.length === 0 && (React.createElement("span", null, "Drag a column and drop it here to group by that column"))),
        grouping.map((columnId) => {
            const column = table.getColumn(columnId);
            if (!column)
                return null;
            return (React.createElement("div", { key: columnId, className: "flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground" },
                React.createElement("span", null, String(column.columnDef.header ?? columnId)),
                React.createElement("button", { type: "button", onClick: () => removeGrouping(columnId), className: "rounded-sm hover:bg-primary-foreground/20" },
                    React.createElement(X, { className: "size-3" }))));
        })));
}

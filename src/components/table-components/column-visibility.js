import React from "react";
export function ColumnVisibility({ table, }) {
    return (React.createElement("details", { className: "relative" },
        React.createElement("summary", { className: "cursor-pointer rounded-md border px-3 py-1 text-sm bg-[#092244] text-white hover:bg-[#0c2c5a]" }, "Columns"),
        React.createElement("div", { className: "absolute right-0 z-20 mt-2 min-w-56 rounded-md border bg-background p-3 shadow-lg" }, table.getAllLeafColumns().map((column) => {
            if (!column.getCanHide())
                return null;
            return (React.createElement("label", { key: column.id, className: "flex cursor-pointer items-center gap-2 py-1.5 text-sm" },
                React.createElement("input", { type: "checkbox", checked: column.getIsVisible(), onChange: column.getToggleVisibilityHandler() }),
                column.columnDef.header));
        }))));
}

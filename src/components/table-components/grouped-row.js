import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";
export function GroupedRow({ row, table, }) {
    const groupedColumnId = row.groupingColumnId;
    if (!groupedColumnId) {
        return null;
    }
    const value = row.getValue(groupedColumnId);
    return (React.createElement("tr", { className: "border-b bg-muted/40" },
        React.createElement("td", { colSpan: table.getVisibleLeafColumns().length, className: "px-4 py-3" },
            React.createElement("button", { type: "button", onClick: row.getToggleExpandedHandler(), className: "flex items-center gap-2 font-semibold" },
                row.getIsExpanded() ? (React.createElement(ChevronDown, { className: "size-4" })) : (React.createElement(ChevronRight, { className: "size-4" })),
                React.createElement("span", null, String(value ?? "")),
                React.createElement("span", { className: "font-normal text-muted-foreground" },
                    "(",
                    row.subRows.length,
                    ")")))));
}

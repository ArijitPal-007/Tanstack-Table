import { ChevronRight, ChevronDown } from "lucide-react";
import React from "react";
export function RowExpander({ row, }) {
    if (!row.getCanExpand()) {
        return React.createElement("div", { className: "w-6" });
    }
    return (React.createElement("button", { type: "button", onClick: row.getToggleExpandedHandler(), className: "flex size-6 items-center justify-center rounded hover:bg-muted" }, row.getIsExpanded() ? (React.createElement(ChevronDown, { className: "size-4" })) : (React.createElement(ChevronRight, { className: "size-4" }))));
}

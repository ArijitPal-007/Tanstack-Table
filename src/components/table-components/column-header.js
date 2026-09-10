import React from "react";
import { ArrowDown, ArrowUp, Check, EqualApproximately, Plus, SquareMenu, X, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ColumnFilter } from "./column-filter";
export function ColumnHeader({ header, aggregation, onAggregationChange, }) {
    if (header.isPlaceholder)
        return null;
    const column = header.column;
    const table = header.getContext().table;
    const sorted = column.getIsSorted();
    const grouped = column.getIsGrouped();
    const isNumber = column.columnDef.meta?.dataType === "number";
    const canFilter = column.getCanFilter();
    return (React.createElement("div", { className: "flex min-w-0 items-center gap-1" },
        React.createElement("div", { className: "min-w-0 flex-1 truncate" },
            React.createElement(table.FlexRender, { header: header })),
        (canFilter ||
            column.getCanSort() ||
            column.getCanGroup() ||
            isNumber) && (React.createElement(Popover, null,
            React.createElement(PopoverTrigger, { render: React.createElement(Button, { variant: "ghost", size: "icon-xs", className: "shrink-0 cursor-pointer hover:bg-gray-300 hover:text-blue-900", "aria-label": `Options for ${column.id}` }) },
                React.createElement(SquareMenu, { className: "size-4" })),
            React.createElement(PopoverContent, { align: "start", className: "w-[430px] p-2" },
                canFilter && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "px-3" },
                        React.createElement("div", { className: "mb-1 text-base font-semibold" }, "Column filter"),
                        React.createElement("div", { className: "mb-3 text-sm text-muted-foreground" }, "Filter will be applied to current column only."),
                        React.createElement(ColumnFilter, { column: column })),
                    React.createElement(Separator, null))),
                column.getCanSort() && (React.createElement("div", { className: "" },
                    React.createElement(Button, { variant: "ghost", className: "w-full justify-start", onClick: () => column.toggleSorting(false) },
                        React.createElement(ArrowUp, { className: "size-4" }),
                        "Sort Ascending"),
                    React.createElement(Button, { variant: "ghost", className: "w-full justify-start", onClick: () => column.toggleSorting(true) },
                        React.createElement(ArrowDown, { className: "size-4" }),
                        "Sort Descending"),
                    React.createElement(Button, { variant: "ghost", disabled: !sorted, className: "w-full justify-start", onClick: () => column.clearSorting() },
                        React.createElement(X, { className: "size-4" }),
                        "Remove Sort"))),
                isNumber && (React.createElement(React.Fragment, null,
                    React.createElement(Separator, null),
                    React.createElement(Button, { variant: "ghost", className: "w-full justify-start", onClick: () => onAggregationChange(column.id, aggregation === "sum" ? null : "sum") },
                        React.createElement(Plus, { className: "size-4" }),
                        "Sum Of Records",
                        aggregation === "sum" && (React.createElement(Check, { className: "ml-auto size-4" }))),
                    React.createElement(Button, { variant: "ghost", className: "w-full justify-start", onClick: () => onAggregationChange(column.id, aggregation === "mean" ? null : "mean") },
                        React.createElement(EqualApproximately, { className: "size-4" }),
                        "Avg Of Records",
                        aggregation === "mean" && (React.createElement(Check, { className: "ml-auto size-4" }))))),
                column.getCanGroup() && (React.createElement(React.Fragment, null,
                    React.createElement(Separator, null),
                    React.createElement(Button, { variant: "ghost", className: "w-full justify-start", onClick: () => column.toggleGrouping() }, grouped
                        ? "Remove from groups"
                        : "Group By this column"))))))));
}

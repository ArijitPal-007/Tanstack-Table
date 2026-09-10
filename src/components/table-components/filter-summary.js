import { BroomSparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
function getHeaderLabel(column) {
    if (!column)
        return "";
    const header = column.columnDef.header;
    return typeof header === "string" ? header : column.id;
}
function formatValue(value) {
    if (Array.isArray(value)) {
        return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
        const filter = value;
        if ("value" in filter) {
            return String(filter.value);
        }
        return JSON.stringify(value);
    }
    return String(value ?? "");
}
export function FilterSummary({ table }) {
    return (React.createElement(table.Subscribe, { selector: (state) => state.columnFilters }, (filters) => {
        const activeFilters = filters ?? [];
        if (activeFilters.length === 0) {
            return null;
        }
        return (React.createElement("div", { className: "bg-background px-3 py-3" },
            React.createElement("div", { className: "flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 shadow-sm" },
                React.createElement(Button, { type: "button", onClick: () => {
                        table.setColumnFilters([]);
                    }, className: "h-10 rounded-lg px-4 text-base font-semibold text-white hover:bg-[#102342]" },
                    React.createElement(BroomSparkles, { className: "size-5" }),
                    "Clear Filters"),
                React.createElement("span", { className: "mx-1 size-3 rounded-full bg-[#071329]" }),
                activeFilters.map((filter) => {
                    const column = table.getColumn(filter.id);
                    if (!column)
                        return null;
                    return (React.createElement("div", { key: filter.id, className: "flex h-10 max-w-full items-center gap-2 rounded-lg border bg-white px-4 text-base shadow-sm" },
                        React.createElement("button", { type: "button", title: "Remove filter", onClick: () => column.setFilterValue(undefined), className: "shrink-0" },
                            React.createElement(X, { className: "size-5 cursor-pointer" })),
                        React.createElement("span", { className: "truncate" },
                            React.createElement("span", { className: "font-medium" }, getHeaderLabel(column)),
                            " ",
                            React.createElement("span", null,
                                "Equals/Contains '",
                                formatValue(filter.value),
                                "'"))));
                }))));
    }));
}

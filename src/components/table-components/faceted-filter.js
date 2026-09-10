import { useMemo } from "react";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
export function FacetedFilter({ column }) {
    const values = useMemo(() => Array.from(column.getFacetedUniqueValues().entries()).sort(([a], [b]) => String(a).localeCompare(String(b))), [column]);
    const selected = String(column.getFilterValue() ?? "");
    return (React.createElement(Select, { value: selected, onValueChange: (value) => {
            column.setFilterValue(value || undefined);
        } },
        React.createElement(SelectTrigger, { className: "h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground" },
            React.createElement(SelectValue, { placeholder: "Select..." })),
        React.createElement(SelectContent, null,
            React.createElement(SelectItem, null, "Select..."),
            values.map(([value, count]) => (React.createElement(SelectItem, { key: String(value), value: String(value) },
                String(value),
                " (",
                count,
                ")"))))));
}

import React from "react";
import { DateFilter } from "./date-filter";
import { FacetedFilter } from "./faceted-filter";
import { Input } from "../ui/input";
export function ColumnFilter({ column, table, }) {
    const filterVariant = column.columnDef.meta?.filterVariant;
    // DATE
    if (filterVariant === "date") {
        return React.createElement(DateFilter, { column: column });
    }
    // FACET / DROPDOWN
    if (filterVariant === "facet") {
        return React.createElement(FacetedFilter, { column: column });
    }
    // TEXT
    const filterValue = column.getFilterValue();
    return (React.createElement(Input, { value: (filterValue ?? ""), onChange: (event) => {
            column.setFilterValue(event.target.value || undefined);
        }, className: "h-12 w-full rounded-md border bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground", placeholder: "Filter..." }));
}

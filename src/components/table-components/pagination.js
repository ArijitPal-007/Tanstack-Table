import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
export function Pagination({ table, }) {
    return (React.createElement("div", { className: "flex items-center justify-between border-t p-3" },
        React.createElement("div", { className: "text-sm text-muted-foreground" },
            "Page ",
            table.state.pagination.pageIndex + 1,
            " of",
            " ",
            table.getPageCount()),
        React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement(Select, { value: String(table.state.pagination.pageSize), onValueChange: (value) => {
                    table.setPageSize(Number(value));
                } },
                React.createElement(SelectTrigger, { className: "h-9 w-[100px]" },
                    React.createElement(SelectValue, null),
                    " rows"),
                React.createElement(SelectContent, null, [5, 10, 20, 50].map((size) => (React.createElement(SelectItem, { key: size, value: String(size) },
                    size,
                    " rows"))))),
            React.createElement(Button, { type: "button", disabled: !table.getCanPreviousPage(), onClick: () => table.previousPage(), className: "inline-flex size-9 items-center justify-center rounded-md border disabled:opacity-40" },
                React.createElement(ChevronLeft, { className: "size-4" })),
            React.createElement(Button, { type: "button", disabled: !table.getCanNextPage(), onClick: () => table.nextPage(), className: "inline-flex size-9 items-center justify-center rounded-md border disabled:opacity-40" },
                React.createElement(ChevronRight, { className: "size-4" })))));
}

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import React from "react";
import * as calendar from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
export function DateFilter({ column }) {
    const [open, setOpen] = useState(false);
    const filterValue = column.getFilterValue();
    const selectedDate = typeof filterValue === "string" && filterValue
        ? new Date(filterValue)
        : undefined;
    return (React.createElement(Popover, { open: open, onOpenChange: setOpen },
        React.createElement(PopoverTrigger, { render: React.createElement(Button, { variant: "outline", className: "h-8 w-full justify-start px-2 text-xs font-normal text-foreground" }) },
            React.createElement(CalendarIcon, { className: "mr-2 size-3.5" }),
            selectedDate ? formatDate(selectedDate) : "Select date..."),
        React.createElement(PopoverContent, { align: "start", className: "w-auto p-0" },
            React.createElement(calendar.Calendar, { mode: "single", selected: selectedDate, onSelect: (date) => {
                    if (!date) {
                        column.setFilterValue(undefined);
                        return;
                    }
                    column.setFilterValue(formatDate(date));
                    setOpen(false);
                } }),
            selectedDate && (React.createElement("div", { className: "border-t p-2" },
                React.createElement(Button, { type: "button", variant: "ghost", className: "w-full text-xs", onClick: () => {
                        column.setFilterValue(undefined);
                        setOpen(false);
                    } }, "Clear date"))))));
}

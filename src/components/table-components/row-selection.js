import React from "react";
export function SelectionHeader({ table }) {
    return (React.createElement(table.Subscribe, { selector: (state) => state.rowSelection }, () => (React.createElement("input", { type: "checkbox", "aria-label": "Select all rows on this page", checked: table.getIsAllPageRowsSelected(), ref: (element) => {
            if (element) {
                element.indeterminate =
                    table.getIsSomePageRowsSelected() &&
                        !table.getIsAllPageRowsSelected();
            }
        }, onChange: table.getToggleAllPageRowsSelectedHandler(), className: "size-4" }))));
}
export function SelectionCell({ row, }) {
    return (React.createElement("input", { type: "checkbox", "aria-label": `Select ${row.original.appraiserName}`, checked: row.getIsSelected(), disabled: !row.getCanSelect(), ref: (element) => {
            if (element) {
                element.indeterminate = row.getIsSomeSelected();
            }
        }, onChange: row.getToggleSelectedHandler(), className: "size-4" }));
}

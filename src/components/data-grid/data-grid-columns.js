import { createColumnHelper } from "@tanstack/react-table";
import { RowOrderHandle } from "../table-components/row-order";
import { SelectionCell, SelectionHeader } from "../table-components/row-selection";
import React from "react";
const columnHelper = createColumnHelper();
const columnConfig = [
    { title: "Appraiser Name", field: "appraiserName", width: 200, type: "string", filterVariant: "text" },
    { title: "Assessment Year", field: "assessmentYear", width: 150, type: "string", filterVariant: "text" },
    { title: "Employee Name", field: "employeeName", width: 200, type: "string", filterVariant: "text" },
    { title: "Assessment Type", field: "assessmentType", width: 150, type: "string", filterVariant: "text" },
    { title: "Initiation Time", field: "initiationTime", width: 180, type: "string", filterVariant: "text" },
    { title: "Role", field: "role", width: 160, type: "string", filterVariant: "facet" },
    { title: "Employee ID", field: "employeeId", width: 140, type: "string", filterVariant: "text" },
    { title: "Last Updated Date", field: "lastUpdatedDate", width: 180, type: "date", filterVariant: "date" },
    { title: "Emoji", field: "emoji", width: 100, type: "string", filterVariant: "facet" },
    { title: "Decimal", field: "decimal", width: 120, type: "number", filterVariant: "text" },
    { title: "Number", field: "number", width: 120, type: "number", filterVariant: "text" },
    { title: "Currency ($)", field: "currency", width: 150, type: "number", filterVariant: "text" },
];
export const columns = columnHelper.columns([
    {
        id: "rowOrder",
        header: "",
        size: 78,
        enableSorting: false,
        enableColumnFilter: false,
        enableGrouping: false,
        cell: ({ row }) => React.createElement(RowOrderHandle, { row: row }),
    },
    columnHelper.display({
        id: "rowSelection",
        header: ({ table }) => React.createElement(SelectionHeader, { table: table }),
        cell: ({ row }) => React.createElement(SelectionCell, { row: row }),
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
        enableGrouping: false,
        enableResizing: false,
    }),
    ...columnConfig.map(config => columnHelper.accessor(config.field, {
        id: config.field,
        header: config.title,
        size: config.width,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: "includesString",
        meta: {
            dataType: config.type,
            filterVariant: config.filterVariant,
        },
        cell: ({ getValue }) => String(getValue() ?? ""),
    }))
]);

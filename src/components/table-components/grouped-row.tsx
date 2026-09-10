import { ChevronDown, ChevronRight } from "lucide-react"
import type { Row, Table } from "@tanstack/react-table"
import React from "react"

type Props<TData> = {
    row: Row<TData>
    table: Table<any, TData>
}

export function GroupedRow<TData>({
    row,
    table,
}: Props<TData>) {
    const groupedColumnId = row.groupingColumnId

    if (!groupedColumnId) {
        return null
    }

    const value = row.getValue(groupedColumnId)

    return (
        <tr className="border-b bg-muted/40">
            <td
                colSpan={table.getVisibleLeafColumns().length}
                className="px-4 py-3"
            >
                <button
                    type="button"
                    onClick={row.getToggleExpandedHandler()}
                    className="flex items-center gap-2 font-semibold"
                >
                    {row.getIsExpanded() ? (
                        <ChevronDown className="size-4" />
                    ) : (
                        <ChevronRight className="size-4" />
                    )}

                    <span>
                        {String(value ?? "")}
                    </span>

                    <span className="font-normal text-muted-foreground">
                        ({row.subRows.length})
                    </span>
                </button>
            </td>
        </tr>
    )
}
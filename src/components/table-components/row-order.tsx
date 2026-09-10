import { GripVertical } from "lucide-react"
import type { Row, Table } from "@tanstack/react-table"
import { Button } from "../ui/button"
import React from "react"

type RowOrderHandleProps<TData> = {
    row: Row<TData>
    table: Table<any, TData>
}

export function RowOrderHandle<TData>({
    row,
    table,
}: RowOrderHandleProps<TData>) {
    const handleDragStart = (
        event: React.DragEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation()

        event.dataTransfer.effectAllowed = "move"

        event.dataTransfer.setData(
            "row-id",
            row.id,
        )

        event.dataTransfer.setData(
            "text/plain",
            row.id,
        )

        table.options.meta?.setDraggingRowId?.(row.id)
    }

    const handleDragEnd = () => {
        table.options.meta?.setDraggingRowId?.(null)
    }

    return (
        <Button
            type="button"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex cursor-grab items-center justify-center rounded p-1 opacity-50 hover:bg-muted hover:opacity-100 active:cursor-grabbing"
            title="Drag to reorder row"
        >
            <GripVertical className="size-4" />
        </Button>
    )
}
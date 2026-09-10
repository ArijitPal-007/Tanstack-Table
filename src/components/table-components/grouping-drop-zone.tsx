import type { Table } from "@tanstack/react-table"
import { X, Layers3 } from "lucide-react"
import React from "react"

import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"

type Props = {
  table: Table<typeof dataGridFeatures, Person>
}

export function GroupingDropZone({ table }: Props) {
  const grouping = table.state.grouping

  function addGrouping(columnId: string) {
    if (!columnId) return

    const column = table.getColumn(columnId)

    if (!column) return

    if (!column.getCanGroup()) {
      return
    }

    if (grouping.includes(columnId)) {
      return
    }

    table.setGrouping((old) => [
      ...old,
      columnId,
    ])
  }

  function removeGrouping(columnId: string) {
    table.setGrouping((old) =>
      old.filter((id) => id !== columnId),
    )
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        event.stopPropagation()

        event.dataTransfer.dropEffect = "move"
      }}
      onDrop={(event) => {
        event.preventDefault()
        event.stopPropagation()

        const columnId =
          event.dataTransfer.getData("column-id") ||
          event.dataTransfer.getData("text/plain")

        addGrouping(columnId)
      }}
      className="flex  w-full flex-wrap items-center gap-2 rounded-lg border border-dashed bg-muted/30 p-3 transition-colors hover:border-primary hover:bg-primary/5"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Layers3 className="size-4" />

        {grouping.length === 0 && (
          <span>
            Drag a column and drop it here to group by
            that column
          </span>
        )}
      </div>

      {grouping.map((columnId) => {
        const column = table.getColumn(columnId)

        if (!column) return null

        return (
          <div
            key={columnId}
            className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
          >
            <span>
              {String(
                column.columnDef.header ?? columnId,
              )}
            </span>

            <button
              type="button"
              onClick={() =>
                removeGrouping(columnId)
              }
              className="rounded-sm hover:bg-primary-foreground/20"
            >
              <X className="size-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
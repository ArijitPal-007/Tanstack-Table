import type { Column, Table } from "@tanstack/react-table"
import { GripVertical } from "lucide-react"
import React from "react"

import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"

type Props = {
  column: Column<typeof dataGridFeatures, Person>
  table: Table<typeof dataGridFeatures, Person>
}

export function ColumnOrderHandle({
  column,
}: Props) {
//   if (!column.getCanReorder()) {
//     return null
//   }

  return (
    <span
      draggable
      onDragStart={(event) => {
        event.stopPropagation()
        event.dataTransfer.effectAllowed = "copyMove"
        // Used by column ordering
        event.dataTransfer.setData(
          "column-id",
          column.id,
        )

        // Used by grouping
        event.dataTransfer.setData(
          "text/plain",
          column.id,
        )
      }}
      onDragEnd={(event) => {
        event.stopPropagation()
      }}
      className="inline-flex cursor-grab touch-none items-center rounded p-0.5 opacity-50 hover:bg-white/10 hover:opacity-100 active:cursor-grabbing"
      title="Drag to reorder or group column"
    >
      <GripVertical className="size-4" />
    </span>
  )
}

export function handleColumnDrop(
  event: React.DragEvent,
  targetColumnId: string,
  table: Table<typeof dataGridFeatures, Person>,
) {
  event.preventDefault()
  event.stopPropagation()

  const draggedColumnId =
    event.dataTransfer.getData("column-id")

  if (
    !draggedColumnId ||
    draggedColumnId === targetColumnId
  ) {
    return
  }

  table.setColumnOrder((previousOrder) => {
    const currentOrder =
      previousOrder.length > 0
        ? [...previousOrder]
        : table
            .getAllLeafColumns()
            .map((column) => column.id)

    const oldIndex =
      currentOrder.indexOf(draggedColumnId)

    const newIndex =
      currentOrder.indexOf(targetColumnId)

    if (oldIndex === -1 || newIndex === -1) {
      return currentOrder
    }

    const [movedColumn] =
      currentOrder.splice(oldIndex, 1)

    currentOrder.splice(newIndex, 0, movedColumn)

    return currentOrder
  })
}
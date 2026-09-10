import type { Column } from "@tanstack/react-table"
import { Pin, PinOff } from "lucide-react"
import React from "react"
import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"
import { Button } from "@base-ui/react"

export function ColumnPinning({
  column,
}: {
  column: Column<typeof dataGridFeatures, Person>
}) {
  const pinned = column.getIsPinned()

  return (
    <Button
      // type="button"
      onClick={() => {
        if (pinned) {
          column.pin(false)
        } else {
          column.pin("start")
        }
      }}
      className="rounded p-1 hover:bg-gray-300 hover:text-blue-900 cursor-pointer"
      title={pinned ? "Unpin column" : "Pin column"}
    >
      {pinned ? (
        <PinOff className="size-4" />
      ) : (
        <Pin className="size-4" />
      )}
    </Button>
  )
}
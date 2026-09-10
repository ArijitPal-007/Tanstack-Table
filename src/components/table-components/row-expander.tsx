import type { Row } from "@tanstack/react-table"
import { ChevronRight, ChevronDown } from "lucide-react"
import React from "react"
import type { Person } from "../data-grid/data-grid-types"
import { dataGridFeatures } from "../data-grid/data-grid-features"

export function RowExpander({
  row,
}: {
  row: Row<typeof dataGridFeatures, Person>
}) {
  if (!row.getCanExpand()) {
    return <div className="w-6" />
  }

  return (
    <button
      type="button"
      onClick={row.getToggleExpandedHandler()}
      className="flex size-6 items-center justify-center rounded hover:bg-muted"
    >
      {row.getIsExpanded() ? (
        <ChevronDown className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </button>
  )
}
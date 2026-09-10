import type {
  Column,
  Table,
} from "@tanstack/react-table"
import React from "react"

import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"

import { DateFilter } from "./date-filter"
import { FacetedFilter } from "./faceted-filter"
import { Input } from "../ui/input"

type Props = {
  column: Column<typeof dataGridFeatures, Person>
  table: Table<typeof dataGridFeatures, Person>
}

export function ColumnFilter({
  column,
  table,
}: Props) {
  const filterVariant =
    column.columnDef.meta?.filterVariant

  // DATE
  if (filterVariant === "date") {
    return <DateFilter column={column} />
  }

  // FACET / DROPDOWN
  if (filterVariant === "facet") {
    return <FacetedFilter column={column} />
  }

  // TEXT
  const filterValue = column.getFilterValue()

  return (
    <Input
      value={(filterValue ?? "") as string}
      onChange={(event) => {
        column.setFilterValue(
          event.target.value || undefined,
        )
      }}
      className="h-12 w-full rounded-md border bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground"
      placeholder="Filter..."
    />
  )
}
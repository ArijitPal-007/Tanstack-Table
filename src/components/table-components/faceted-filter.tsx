import { useMemo } from "react"
import type { Column } from "@tanstack/react-table"
import React from "react"

import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type Props = {
  column: Column<typeof dataGridFeatures, Person>
}

export function FacetedFilter({ column }: Props) {
  const values = useMemo(
    () =>
      Array.from(column.getFacetedUniqueValues().entries()).sort(
        ([a], [b]) => String(a).localeCompare(String(b))
      ),
    [column]
  )

  const selected = String(column.getFilterValue() ?? "")

  return (
    <Select
      value={selected}
      onValueChange={(value) => {
        column.setFilterValue(value || undefined)
      }}
    >
      <SelectTrigger className="h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>

      <SelectContent>
        <SelectItem>
          Select...
        </SelectItem>

        {values.map(([value, count]) => (
          <SelectItem
            key={String(value)}
            value={String(value)}
          >
            {String(value)} ({count})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
import type { Table } from "@tanstack/react-table"
import React from "react"
import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"

export function ColumnVisibility({
  table,
}: {
  table: Table<typeof dataGridFeatures, Person>
}) {
  return (
    <details className="relative">
      <summary className="cursor-pointer rounded-md border px-3 py-1 text-sm bg-[#092244] text-white hover:bg-[#0c2c5a]">
        Columns
      </summary>
      <div className="absolute right-0 z-20 mt-2 min-w-56 rounded-md border bg-background p-3 shadow-lg">
        {table.getAllLeafColumns().map((column) => {
          if (!column.getCanHide()) return null

          return (
            <label
              key={column.id}
              className="flex cursor-pointer items-center gap-2 py-1.5 text-sm"
            >
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />

              {column.columnDef.header as React.ReactNode}            
              </label>
          )
        })}
      </div>
    </details>
  )
}
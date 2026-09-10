import type { Row, Table } from "@tanstack/react-table"
import React from "react"
import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"

type Props = {
  table: Table<typeof dataGridFeatures, Person>
}

export function SelectionHeader({ table }: Props) {
  return (
    <table.Subscribe selector={(state) => state.rowSelection}>
      {() => (
        <input
          type="checkbox"
          aria-label="Select all rows on this page"
          checked={table.getIsAllPageRowsSelected()}
          ref={(element) => {
            if (element) {
              element.indeterminate =
                table.getIsSomePageRowsSelected() &&
                !table.getIsAllPageRowsSelected()
            }
          }}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="size-4"
        />
      )}
    </table.Subscribe>
  )
}

export function SelectionCell({
  row,
}: {
  row: Row<typeof dataGridFeatures, Person>
}) {
  return (
    <input
      type="checkbox"
      aria-label={`Select ${row.original.appraiserName}`}
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      ref={(element) => {
        if (element) {
          element.indeterminate = row.getIsSomeSelected()
        }
      }}
      onChange={row.getToggleSelectedHandler()}
      className="size-4"
    />
  )
}
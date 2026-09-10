import type { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export function Pagination({
  table,
}: {
  table: Table<typeof dataGridFeatures, Person>
}) {
  return (
    <div className="flex items-center justify-between border-t p-3">
      <div className="text-sm text-muted-foreground">
        Page {table.state.pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={String(table.state.pagination.pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-9 w-[100px]">
            <SelectValue /> rows
          </SelectTrigger>

          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className="inline-flex size-9 items-center justify-center rounded-md border disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          type="button"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className="inline-flex size-9 items-center justify-center rounded-md border disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
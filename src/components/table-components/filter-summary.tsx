import type { Table } from "@tanstack/react-table"
import { BroomSparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Person } from "../data-grid/data-grid-types"
import React from "react"

type Props = {
  table: Table<Person>
}

function getHeaderLabel(column: ReturnType<Props["table"]["getColumn"]>) {
  if (!column) return ""

  const header = column.columnDef.header
  return typeof header === "string" ? header : column.id
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ")
  }

  if (typeof value === "object" && value !== null) {
    const filter = value as Record<string, unknown>

    if ("value" in filter) {
      return String(filter.value)
    }

    return JSON.stringify(value)
  }

  return String(value ?? "")
}

export function FilterSummary({ table }: Props) {
  return (
    <table.Subscribe selector={(state) => state.columnFilters}>
      {(filters) => {
        const activeFilters = filters ?? []

        if (activeFilters.length === 0) {
          return null
        }

        return (
          <div className="bg-background px-3 py-3">
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 shadow-sm">
              <Button
                type="button"
                onClick={() => {
                  table.setColumnFilters([])
                }}
                className="h-10 rounded-lg px-4 text-base font-semibold text-white hover:bg-[#102342]"
              >
                <BroomSparkles className="size-5" />
                Clear Filters
              </Button>

              <span className="mx-1 size-3 rounded-full bg-[#071329]" />

              {activeFilters.map((filter) => {
                const column = table.getColumn(filter.id)

                if (!column) return null

                return (
                  <div
                    key={filter.id}
                    className="flex h-10 max-w-full items-center gap-2 rounded-lg border bg-white px-4 text-base shadow-sm"
                  >
                    <button
                      type="button"
                      title="Remove filter"
                      onClick={() => column.setFilterValue(undefined)}
                      className="shrink-0"
                    >
                      <X className="size-5 cursor-pointer" />
                    </button>

                    <span className="truncate">
                      <span className="font-medium">
                        {getHeaderLabel(column)}
                      </span>{" "}
                      <span>
                        Equals/Contains '{formatValue(filter.value)}'
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }}
    </table.Subscribe>
  )
}
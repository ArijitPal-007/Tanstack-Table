import React from "react"
import type { Header } from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowUp,
  Check,
  EqualApproximately,
  Plus,
  SquareMenu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"
import { ColumnFilter } from "./column-filter"

type Aggregation = "sum" | "mean"

type Props = {
  header: Header<typeof dataGridFeatures, Person>
  aggregation?: Aggregation
  onAggregationChange: (
    columnId: string,
    aggregation: Aggregation | null,
  ) => void
}

export function ColumnHeader({
  header,
  aggregation,
  onAggregationChange,
}: Props) {
  if (header.isPlaceholder) return null

  const column = header.column
  const table = header.getContext().table
  const sorted = column.getIsSorted()
  const grouped = column.getIsGrouped()
  const isNumber = column.columnDef.meta?.dataType === "number"
  const canFilter = column.getCanFilter()

  return (
    <div className="flex min-w-0 items-center gap-1">
      <div className="min-w-0 flex-1 truncate">
        <table.FlexRender header={header} />
      </div>

      {(canFilter ||
        column.getCanSort() ||
        column.getCanGroup() ||
        isNumber) && (
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0 cursor-pointer hover:bg-gray-300 hover:text-blue-900"
                aria-label={`Options for ${column.id}`}
              />
            }
          >
            <SquareMenu className="size-4" />
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="w-[430px] p-2"
          >
            {canFilter && (
              <>
                <div className="px-3">
                  <div className="mb-1 text-base font-semibold">
                    Column filter
                  </div>

                  <div className="mb-3 text-sm text-muted-foreground">
                    Filter will be applied to current column only.
                  </div>

                  <ColumnFilter column={column} />
                </div>

                <Separator />
              </>
            )}

            {column.getCanSort() && (
              <div className="">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => column.toggleSorting(false)}
                >
                  <ArrowUp className="size-4" />
                  Sort Ascending
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => column.toggleSorting(true)}
                >
                  <ArrowDown className="size-4" />
                  Sort Descending
                </Button>

                <Button
                  variant="ghost"
                  disabled={!sorted}
                  className="w-full justify-start"
                  onClick={() => column.clearSorting()}
                >
                  <X className="size-4" />
                  Remove Sort
                </Button>
              </div>
            )}

            {isNumber && (
              <>
                <Separator />

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() =>
                    onAggregationChange(
                      column.id,
                      aggregation === "sum" ? null : "sum",
                    )
                  }
                >
                  <Plus className="size-4" />
                  Sum Of Records

                  {aggregation === "sum" && (
                    <Check className="ml-auto size-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() =>
                    onAggregationChange(
                      column.id,
                      aggregation === "mean" ? null : "mean",
                    )
                  }
                >
                  <EqualApproximately className="size-4" />
                  Avg Of Records

                  {aggregation === "mean" && (
                    <Check className="ml-auto size-4" />
                  )}
                </Button>
              </>
            )}

            {column.getCanGroup() && (
              <>
                <Separator />

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => column.toggleGrouping()}
                >
                  {grouped
                    ? "Remove from groups"
                    : "Group By this column"}
                </Button>
              </>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
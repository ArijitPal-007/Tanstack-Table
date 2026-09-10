import { useState } from "react"
import type { Column } from "@tanstack/react-table"
import { CalendarIcon } from "lucide-react"
import React from "react"
import * as calendar from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { dataGridFeatures } from "../data-grid/data-grid-features"
import type { Person } from "../data-grid/data-grid-types"

type Props = {
  column: Column<typeof dataGridFeatures, Person>
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

export function DateFilter({ column }: Props) {
  const [open, setOpen] = useState(false)
  const filterValue = column.getFilterValue()
  const selectedDate =
    typeof filterValue === "string" && filterValue
      ? new Date(filterValue)
      : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
     <PopoverTrigger
  render={
    <Button
      variant="outline"
      className="h-8 w-full justify-start px-2 text-xs font-normal text-foreground"
    />
  }
>
  <CalendarIcon className="mr-2 size-3.5" />
  {selectedDate ? formatDate(selectedDate) : "Select date..."}
</PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto p-0"
      >
        <calendar.Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (!date) {
              column.setFilterValue(undefined)
              return
            }

            column.setFilterValue(
              formatDate(date),
            )

            setOpen(false)
          }}
        />

        {selectedDate && (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs"
              onClick={() => {
                column.setFilterValue(undefined)
                setOpen(false)
              }}
            >
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
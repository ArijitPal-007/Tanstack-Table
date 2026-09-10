import type { Row, Table } from "@tanstack/react-table"
import type { Person } from "../data-grid/data-grid-types"
import { dataGridFeatures } from "../data-grid/data-grid-features"
import React from "react"

type Props = {
  row: Row<Person>
  table: Table<typeof dataGridFeatures, Person>
}

export function DetailRow({ row, table }: Props) {
  const tasks = row.original.details?.inProcessTasks ?? []

  return (
    <tr>
      <td
        colSpan={table.getVisibleLeafColumns().length}
        className="bg-muted/20 p-0"
      >
        <div className="ml-10 my-2 overflow-hidden rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="bg-[#092244] text-white">
                <th className="px-3 py-2 text-left">
                  In-process Tasks
                </th>
                <th className="px-3 py-2 text-left">
                  Group
                </th>
                <th className="px-3 py-2 text-left">
                  User
                </th>
                <th className="px-3 py-2 text-left">
                  Start Time
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-2">
                      {task.task}
                    </td>
                    <td className="px-3 py-2">
                      {task.group}
                    </td>
                    <td className="px-3 py-2">
                      {task.user}
                    </td>
                    <td className="px-3 py-2">
                      {task.startTime}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No data to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  )
}
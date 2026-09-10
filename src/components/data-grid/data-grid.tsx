import React, { useEffect, useState } from "react"
import { useTable } from "@tanstack/react-table"

import { dataGridFeatures } from "./data-grid-features"
import { columns } from "./data-grid-columns"
import type { Person } from "./data-grid-types"

import {
    ColumnOrderHandle,
    handleColumnDrop,
} from "../table-components/column-order"

import { ColumnFilter } from "../table-components/column-filter"
import { ColumnHeader } from "../table-components/column-header"
import { ColumnResizer } from "../table-components/column-resizer"
import { ColumnVisibility } from "../table-components/column-visibility"
import { ColumnPinning } from "../table-components/column-pinning"
import { GroupingDropZone } from "../table-components/grouping-drop-zone"
import { Pagination } from "../table-components/pagination"
import { AggregationFooter } from "../table-components/aggregation"
import { GroupedRow } from "../table-components/grouped-row"
import { DetailRow } from "../table-components/detail-row"
import { RowExpander } from "../table-components/row-expander"
import { exportTableToCSV } from "../table-components/export-csv"
import { SelectionHeader } from "../table-components/row-selection"

import { Button } from "../ui/button"

import {
    ArrowDownWideNarrow,
    Blocks,
    BroomSparkles,
    Download,
    RotateCcw,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { FilterSummary } from "../table-components/filter-summary"


type DataGridProps = {
    data: Person[]
}

type Aggregation = "sum" | "mean"

const COLUMN_FILTERS_STORAGE_KEY = "employee-assessments-column-filters"

type PersistedColumnFilter = {
    id: string
    value: unknown
}

function getPersistedColumnFilters(): PersistedColumnFilter[] {
    if (typeof window === "undefined") {
        return []
    }

    try {
        const stored = window.sessionStorage.getItem(COLUMN_FILTERS_STORAGE_KEY)

        if (!stored) {
            return []
        }

        const parsed: unknown = JSON.parse(stored)

        if (!Array.isArray(parsed)) {
            return []
        }

        return parsed.filter(
            (filter): filter is PersistedColumnFilter =>
                typeof filter === "object" &&
                filter !== null &&
                "id" in filter &&
                typeof filter.id === "string" &&
                "value" in filter,
        )
    } catch {
        return []
    }
}

function ColumnFiltersPersistence({
    filters,
}: {
    filters: PersistedColumnFilter[]
}) {
    useEffect(() => {
        window.sessionStorage.setItem(
            COLUMN_FILTERS_STORAGE_KEY,
            JSON.stringify(filters),
        )
    }, [filters])

    return null
}


export function DataGrid({
    data: initialData,
}: DataGridProps) {

    const [data, setData] = useState<Person[]>(initialData,)

    const [aggregations, setAggregations] = useState<
        Record<string, Aggregation>
    >({})

    const handleAggregationChange = (
        columnId: string,
        aggregation: Aggregation | null,
    ) => {
        setAggregations((current) => {
            if (aggregation === null) {
                const next = { ...current }
                delete next[columnId]
                return next
            }

            return {
                ...current,
                [columnId]: aggregation,
            }
        })
    }

    useEffect(() => {
        setData(initialData)
    }, [initialData])

    const navigate = useNavigate()


    /*
     * ============================================================
     * ROW DRAG STATE
     * ============================================================
     */

    const [draggingRowId, setDraggingRowId] =
        useState<string | null>(null)

    const [dragOverRowId, setDragOverRowId] =
        useState<string | null>(null)


    const moveRow = (
        sourceRowId: string,
        targetRowId: string,
    ) => {

        if (
            !sourceRowId ||
            !targetRowId ||
            sourceRowId === targetRowId
        ) {
            return
        }

        setData((currentData) => {

            const sourceIndex =
                currentData.findIndex(
                    (item) =>
                        String(item.contractid ?? item.id) ===
                        String(sourceRowId),
                )

            const targetIndex =
                currentData.findIndex(
                    (item) =>
                        String(item.contractid ?? item.id) ===
                        String(targetRowId),
                )


            if (
                sourceIndex === -1 ||
                targetIndex === -1
            ) {
                return currentData
            }


            const nextData = [
                ...currentData,
            ]


            /*
             * Remove source row
             */

            const [
                movedRow,
            ] = nextData.splice(
                sourceIndex,
                1,
            )


            /*
             * Insert it before target row
             */

            const newTargetIndex =
                nextData.findIndex(
                    (item) =>
                        String(item.contractid ?? item.id) ===
                        String(targetRowId),
                )
            nextData.splice(
                newTargetIndex,
                0,
                movedRow,
            )
            return nextData
        })
    }

    //  * ROW DRAG START

    const handleRowDragStart = (event: React.DragEvent<HTMLTableRowElement>, rowId: string) => {
        event.stopPropagation()
        setDraggingRowId(rowId)
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("row-id", rowId)
        event.dataTransfer.setData("text/plain", rowId)
    }

    //  * ROW DRAG OVER

    const handleRowDragOver = (event: React.DragEvent<HTMLTableRowElement>, rowId: string) => {
        event.preventDefault()
        event.stopPropagation()
        event.dataTransfer.dropEffect = "move"
        setDragOverRowId(rowId)
    }

    //  * ROW DROP

    const handleRowDrop = (event: React.DragEvent<HTMLTableRowElement>, targetRowId: string) => {
        event.preventDefault()
        event.stopPropagation()
        const sourceRowId = event.dataTransfer.getData("row-id",) || event.dataTransfer.getData("text/plain")

        if (!sourceRowId) {
            return
        }

        moveRow(sourceRowId, targetRowId)
        setDraggingRowId(null)
        setDragOverRowId(null)
    }

    //  * ROW DRAG END

    const handleRowDragEnd = (event: React.DragEvent<HTMLTableRowElement>) => {
        event.stopPropagation()
        setDraggingRowId(null)
        setDragOverRowId(null)
    }

    //  * TABLE

    const table = useTable({
        key: "employee-assessments",
        features: dataGridFeatures,
        data,
        columns,
        getRowId: (row) =>
            String(row.contractid ?? row.id),
        getRowCanExpand: (row) =>
            Boolean(row.original.details?.inProcessTasks?.length),


        enableRowSelection: true,
        groupedColumnMode: "reorder",
        columnResizeMode: "onEnd",
        initialState: {
            columnFilters: getPersistedColumnFilters(),
            pagination: {
                pageIndex: 0, pageSize: 5,
            },

            columnPinning: {
                start: ["select"],
                end: [],
            },
        },
    })

    //  * RENDER

    return (
        <div className="w-full py-10  overflow-hidden rounded-xl border bg-background shadow-sm">
            <table.Subscribe selector={(state) => state.columnFilters}>
                {(filters) => (
                    <ColumnFiltersPersistence filters={filters} />
                )}
            </table.Subscribe>

            {/* TOOLBAR */}
            <div className="flex flex-wrap justify-end items-center gap-2 border-b px-2 p-1">
                <ColumnVisibility
                    table={table}
                />

                <Button
                    type="button"
                    onClick={() => exportTableToCSV(table)}
                >
                    <Download />
                    Export CSV
                </Button>

                {/* <Button
                    type="button"
                    onClick={() => table.resetColumnFilters()}
                >
                    <BroomSparkles />
                    Clear Filters
                </Button> */}

                <Button
                    type="button"
                    onClick={() => table.resetSorting()}
                >
                    <ArrowDownWideNarrow />
                    Clear Sorting
                </Button>


                <Button
                    type="button"
                    onClick={() => table.resetGrouping()}
                >
                    <Blocks />
                    Clear Grouping
                </Button>

                <Button
                    type="button"
                    onClick={() => {
                        table.setColumnFilters([])
                        table.resetSorting()
                        table.resetGrouping()
                        table.resetExpanded()
                        table.resetRowSelection()
                        table.resetColumnVisibility()
                        table.resetColumnPinning()
                        table.resetColumnOrder()
                        table.resetColumnSizing()
                        table.resetPagination()
                        setAggregations({})
                        setData(initialData)
                    }}
                >
                    <RotateCcw />
                    Reset Grid Setting
                </Button>
            </div>
            {/* GROUPING DROP ZONE */}

            <div className="p-3">
                <GroupingDropZone
                    table={table}
                />
            </div>
            <div className="w-full overflow-auto">
                <table className="w-full min-w-[1500px] table-fixed border-collapse">
                    {/* HEADER */}
                    <thead>
                        {table
                            .getHeaderGroups()
                            .map(
                                (headerGroup) => (
                                    <tr
                                        key={headerGroup.id}
                                    >
                                        {headerGroup.headers.map(
                                            (header) => {
                                                const column = header.column
                                                return (
                                                    <th
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                        data-column-id={column.id}
                                                        className="relative border-r border-b border-white/40 bg-[#092244] px-3 py-3 text-left text-sm font-semibold text-white last:border-r-0"
                                                        style={{
                                                            width: header.getSize(),
                                                            position: column.getIsPinned() ? "sticky" : "relative",
                                                            insetInlineStart:
                                                                column.getIsPinned() ===
                                                                    "start"
                                                                    ? `${column.getStart(
                                                                        "start",
                                                                    )}px`
                                                                    : undefined, insetInlineEnd:
                                                                column.getIsPinned() ===
                                                                    "end"
                                                                    ? `${column.getAfter(
                                                                        "end",
                                                                    )}px`
                                                                    : undefined,
                                                            zIndex:
                                                                column.getIsPinned() ? 10 : 1,
                                                        }}
                                                    >
                                                        {header.isPlaceholder ? null : column.id === "rowSelection" ? (
                                                            <div className="flex items-center justify-center">
                                                                <SelectionHeader table={table} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="flex items-center gap-1">
                                                                    {column.id !== "ID" &&
                                                                        column.id !== "expand" &&
                                                                        column.id !== "rowOrder" && (
                                                                            <ColumnOrderHandle
                                                                                column={column}
                                                                                table={table}
                                                                            />
                                                                        )}

                                                                    <div
                                                                        className="min-w-0 flex-1"
                                                                        onDragOver={event => {
                                                                            event.preventDefault()
                                                                            event.stopPropagation()
                                                                        }}
                                                                        onDrop={event => {
                                                                            handleColumnDrop(
                                                                                event,
                                                                                column.id,
                                                                                table,
                                                                            )
                                                                        }}
                                                                    >
                                                                        <ColumnHeader
                                                                            header={header}
                                                                            onAggregationChange={handleAggregationChange}
                                                                            aggregation={aggregations[column.id]}
                                                                        />
                                                                    </div>

                                                                    {column.id !== "ID" &&
                                                                        column.id !== "expand" &&
                                                                        column.id !== "rowOrder" && (
                                                                            <ColumnPinning column={column} />
                                                                        )}
                                                                </div>

                                                                {/* {column.getCanFilter() && (
                                                                    <div className="mt-2">
                                                                        <ColumnFilter column={column} />
                                                                    </div>
                                                                )} */}

                                                                <ColumnResizer header={header} />
                                                            </>
                                                        )}

                                                    </th>
                                                )
                                            },
                                        )}
                                    </tr>
                                ),
                            )}
                    </thead>


                    {/* =================================================
                        BODY
                    ================================================== */}

                    <table.Subscribe
                        selector={(state) => ({
                            columnFilters:
                                state.columnFilters,
                            sorting:
                                state.sorting,

                            grouping:
                                state.grouping,

                            expanded:
                                state.expanded,

                            pagination:
                                state.pagination,

                            rowSelection:
                                state.rowSelection,

                            columnVisibility:
                                state.columnVisibility,

                            columnPinning:
                                state.columnPinning,

                            columnOrder:
                                state.columnOrder,

                            columnSizing:
                                state.columnSizing,

                        })}

                    >

                        {() => (

                            <tbody>
                                {table.getRowModel().rows.map((row) => {
                                        if (
                                            row.getIsGrouped()
                                        ) {
                                            return (
                                                <GroupedRow
                                                    key={row.id}
                                                    row={row}
                                                    table={table}
                                                />
                                            )
                                        }
                                        {/* =================================================
                                            NORMAL ROW
                                        ================================================== */}
                                        const isDragging = draggingRowId === row.id
                                        const isDragOver = dragOverRowId === row.id


                                        return (

                                            <React.Fragment
                                                key={
                                                    row.id
                                                }
                                            >

                                                <tr
                                                    draggable
    onDoubleClick={() => navigate(`/assessment/${row.original.id}`)}
    onDragStart={(event) =>
        handleRowDragStart(event, row.id)
    }
                                                    onDragOver={(event) =>
                                                        handleRowDragOver(
                                                            event,
                                                            row.id,
                                                        )
                                                    }

                                                    onDrop={(event) =>
                                                        handleRowDrop(
                                                            event,
                                                            row.id,
                                                        )
                                                    }

                                                    onDragEnd={handleRowDragEnd}
                                                    className={`
                                                        border-b
                                                        transition-all
                                                          odd:bg-white even:bg-blue-100
                                                        ${row.getIsSelected()
                                                            ? "bg-primary/5"
                                                            : "hover:bg-muted/40"
                                                        }

                                                        ${isDragging
                                                            ? "opacity-40"
                                                            : ""
                                                        }

                                                        ${isDragOver
                                                            ? "border-t-2 border-primary bg-primary/5"
                                                            : ""
                                                        }
                                                    `}
                                                >
                                                    {row.getVisibleCells().map((cell) => {
                                                                const column = cell.column
                                                                return (
                                                                    <td
                                                                        key={cell.id}
                                                                        className={`border-r px-3 py-3 text-sm last:border-r-0 ${typeof cell.getValue() === "number"
                                                                            ? "text-right" :
                                                                            typeof cell.getValue() === "string" ? "text-left"
                                                                                : "text-center"
                                                                            }`}
                                                                        style={{
                                                                            width:
                                                                                `${column.getSize()}px`,

                                                                            minWidth:
                                                                                `${column.getSize()}px`,

                                                                            maxWidth:
                                                                                `${column.getSize()}px`,

                                                                            position:
                                                                                column.getIsPinned()
                                                                                    ? "sticky"
                                                                                    : "relative",

                                                                            insetInlineStart:
                                                                                column.getIsPinned() ===
                                                                                    "start"
                                                                                    ? `${column.getStart(
                                                                                        "start",
                                                                                    )}px`
                                                                                    : undefined,

                                                                            insetInlineEnd:
                                                                                column.getIsPinned() ===
                                                                                    "end"
                                                                                    ? `${column.getAfter(
                                                                                        "end",
                                                                                    )}px`
                                                                                    : undefined,

                                                                            zIndex:
                                                                                column.getIsPinned()
                                                                                    ? 5
                                                                                    : 0,

                                                                            background:
                                                                                column.getIsPinned()
                                                                                    ? "var(--background)"
                                                                                    : undefined,
                                                                        }}
                                                                    >
                                                                        {cell === row.getVisibleCells()[0] ? (
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <RowExpander row={row} />
                                                                                <table.FlexRender
                                                                                    cell={cell}
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <table.FlexRender
                                                                                cell={cell}
                                                                            />
                                                                        )}
                                                                    </td>
                                                                )
                                                            },
                                                        )}
                                                </tr>
                                                {/* =================================================
                                                    DETAIL ROW
                                                ================================================== */}
                                                {row.getIsExpanded() && (
                                                    <DetailRow
                                                        row={row}
                                                        table={table}
                                                    />
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                {/* EMPTY */}
                                {table
                                    .getRowModel()
                                    .rows
                                    .length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={
                                                    table
                                                        .getVisibleLeafColumns()
                                                        .length
                                                }
                                                className="h-32 text-center text-sm text-muted-foreground"
                                            >
                                                No results found.
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        )}
                    </table.Subscribe>
                    {/* FOOTER */}
                    <tfoot>
                        {table
                            .getFooterGroups()
                            .map(
                                (footerGroup) => (
                                    <tr
                                        key={footerGroup.id}
                                    >
                                        {footerGroup.headers.map(
                                            (footer) => (
                                                <td
                                                    key={footer.id}
                                                    className="border-t bg-muted/30 px-3 py-3 text-sm font-medium"
                                                >
                                                    {footer.isPlaceholder
                                                        ? null
                                                        : (
                                                            <table.FlexRender
                                                                footer={footer}
                                                            />
                                                        )}
                                                </td>
                                            ),
                                        )}
                                    </tr>
                                ),
                            )}
                        <AggregationFooter
                            table={table}
                            aggregations={aggregations}
                        />
                    </tfoot>
                </table>
            </div>
            {/* PAGINATION */}
            <Pagination table={table} />
            <FilterSummary table={table} />

        </div>
    )
}
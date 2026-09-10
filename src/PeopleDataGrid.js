import * as React from 'react';
import { columnFilteringFeature, columnVisibilityFeature, createColumnHelper, createFilteredRowModel, createPaginatedRowModel, createSortedRowModel, flexRender, globalFilteringFeature, rowPaginationFeature, rowSelectionFeature, rowSortingFeature, tableFeatures, useTable, } from '@tanstack/react-table';
/* -------------------------------------------------------------------------- */
/* Features                                                                   */
/* -------------------------------------------------------------------------- */
/*
 * TanStack Table v9:
 *
 * - Core row model is automatic.
 * - Features are explicitly registered.
 * - Row-model factories live on tableFeatures().
 * - Keep this static and outside React components.
 */
const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
});
/* -------------------------------------------------------------------------- */
/* Table metadata                                                             */
/* -------------------------------------------------------------------------- */
const columnHelper = createColumnHelper();
/* -------------------------------------------------------------------------- */
/* Columns                                                                    */
/* -------------------------------------------------------------------------- */
const columns = columnHelper.columns([
    /*
     * Selection
     */
    columnHelper.display({
        id: 'select',
        enableColumnFilter: false,
        header: ({ table }) => (React.createElement("input", { type: "checkbox", "aria-label": "Select all rows", checked: table.getIsAllRowsSelected(), ref: element => {
                if (element) {
                    element.indeterminate =
                        table.getIsSomeRowsSelected();
                }
            }, onChange: table.getToggleAllRowsSelectedHandler() })),
        cell: ({ row }) => (React.createElement("input", { type: "checkbox", "aria-label": `Select ${row.original.name}`, checked: row.getIsSelected(), disabled: !row.getCanSelect(), ref: element => {
                if (element) {
                    element.indeterminate =
                        row.getIsSomeSelected();
                }
            }, onChange: row.getToggleSelectedHandler() })),
    }),
    /*
     * Row number (extra column) - reflects position within the
     * current sorted/filtered/paginated view, not a stored value.
     */
    columnHelper.display({
        id: 'rowNumber',
        enableColumnFilter: false,
        header: '#',
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.state.pagination;
            return pageIndex * pageSize + row.index + 1;
        },
    }),
    /*
     * Name
     */
    columnHelper.accessor('name', {
        header: ({ column }) => (React.createElement("button", { type: "button", onClick: column.getToggleSortingHandler() },
            "Name",
            column.getIsSorted() === 'asc' && ' ↑',
            column.getIsSorted() === 'desc' && ' ↓')),
        cell: ({ getValue }) => getValue(),
    }),
    /*
     * Email
     */
    columnHelper.accessor('email', {
        header: ({ column }) => (React.createElement("button", { type: "button", onClick: column.getToggleSortingHandler() },
            "Email",
            column.getIsSorted() === 'asc' && ' ↑',
            column.getIsSorted() === 'desc' && ' ↓')),
        cell: ({ getValue }) => getValue(),
    }),
    /*
     * Role
     */
    columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ getValue }) => getValue(),
    }),
    /*
     * Active
     *
     * Boolean column - default string-includes filtering doesn't make
     * sense here, so it gets its own filterFn and a select input
     * (see ColumnFilter below) instead of a free-text box.
     */
    columnHelper.accessor('active', {
        header: 'Active',
        cell: ({ getValue }) => getValue() ? 'Yes' : 'No',
        filterFn: (row, columnId, filterValue) => {
            if (!filterValue)
                return true;
            return String(row.getValue(columnId)) === filterValue;
        },
    }),
]);
/* -------------------------------------------------------------------------- */
/* Grid                                                                       */
/* -------------------------------------------------------------------------- */
export default function PeopleDataGrid({ data, }) {
    /*
     * V9 owns the table state through TanStack Store.
     *
     * We are deliberately NOT doing:
     *
     * const [sorting, setSorting] = useState(...)
     * const [pagination, setPagination] = useState(...)
     * const [filter, setFilter] = useState(...)
     *
     * Those are table state and stay inside the table.
     */
    const table = useTable({
        features,
        columns,
        data,
        /*
         * Initial values are preferable to duplicating table state
         * in React state.
         */
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },
    }, 
    /*
     * Select only the table state this component needs to
     * subscribe to.
     *
     * This prevents every table-state change from forcing the
     * entire component to render.
     */
    state => ({
        pagination: state.pagination,
        globalFilter: state.globalFilter,
        columnFilters: state.columnFilters,
        rowSelection: state.rowSelection,
        columnVisibility: state.columnVisibility,
    }));
    return (React.createElement("div", { style: styles.container },
        React.createElement(Toolbar, { table: table }),
        React.createElement("table", { style: styles.table },
            React.createElement("thead", null,
                table.getHeaderGroups().map(headerGroup => (React.createElement("tr", { key: headerGroup.id }, headerGroup.headers.map(header => (React.createElement("th", { key: header.id, scope: "col", style: styles.th }, header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext()))))))),
                React.createElement("tr", null, table.getHeaderGroups()[0]?.headers.map(header => (React.createElement("th", { key: `filter-${header.id}`, scope: "col", style: styles.filterTh }, header.column.getCanFilter() ? (React.createElement(ColumnFilter, { column: header.column })) : null))))),
            React.createElement("tbody", null, table.getRowModel().rows.length === 0 ? (React.createElement("tr", null,
                React.createElement("td", { colSpan: table.getVisibleLeafColumns().length, style: styles.empty }, "No results"))) : (table.getRowModel().rows.map(row => (React.createElement("tr", { key: row.id, "data-selected": row.getIsSelected() || undefined }, row.getVisibleCells().map(cell => (React.createElement("td", { key: cell.id, style: styles.td }, flexRender(cell.column.columnDef.cell, cell.getContext())))))))))),
        React.createElement(Pagination, { table: table })));
}
/* -------------------------------------------------------------------------- */
/* Column filter input                                                       */
/* -------------------------------------------------------------------------- */
function ColumnFilter({ column, }) {
    const filterValue = column.getFilterValue();
    // Boolean "active" column gets a select instead of free text, since
    // the values are Yes/No rather than searchable text.
    return (React.createElement("input", { type: "text", "aria-label": `Filter ${column.id}`, placeholder: "Filter...", value: filterValue ?? '', onChange: event => column.setFilterValue(event.target.value || undefined), style: styles.filterInput }));
}
/* -------------------------------------------------------------------------- */
/* Toolbar                                                                    */
/* -------------------------------------------------------------------------- */
function Toolbar({ table, }) {
    return (React.createElement("div", { style: styles.toolbar },
        React.createElement("input", { type: "search", placeholder: "Search people...", value: table.state.globalFilter ?? '', onChange: event => table.setGlobalFilter(event.target.value), style: styles.search }),
        React.createElement("details", null,
            React.createElement("summary", null, "Columns"),
            React.createElement("div", { style: styles.columnMenu }, table.getAllLeafColumns().map(column => (React.createElement("label", { key: column.id },
                React.createElement("input", { type: "checkbox", checked: column.getIsVisible(), onChange: column.getToggleVisibilityHandler() }),
                ' ',
                column.id))))),
        React.createElement(ClearFiltersButton, { table: table }),
        React.createElement(SelectedCount, { table: table })));
}
/* -------------------------------------------------------------------------- */
/* Clear filters                                                             */
/* -------------------------------------------------------------------------- */
function ClearFiltersButton({ table, }) {
    return (React.createElement(table.Subscribe, { selector: state => state.columnFilters }, columnFilters => (React.createElement("button", { type: "button", onClick: () => table.resetColumnFilters(), disabled: columnFilters.length === 0 }, "Clear filters"))));
}
/* -------------------------------------------------------------------------- */
/* Reactive state example                                                     */
/* -------------------------------------------------------------------------- */
function SelectedCount({ table, }) {
    /*
     * This component subscribes only to rowSelection.
     *
     * table.Subscribe is the v9 Store-backed reactive API.
     */
    return (React.createElement(table.Subscribe, { selector: state => state.rowSelection }, rowSelection => (React.createElement("span", null,
        Object.keys(rowSelection).length,
        " selected"))));
}
/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */
function Pagination({ table, }) {
    return (React.createElement(table.Subscribe, { selector: state => state.pagination }, pagination => (React.createElement("nav", { "aria-label": "People pagination", style: styles.pagination },
        React.createElement("button", { type: "button", disabled: !table.getCanPreviousPage(), onClick: () => table.previousPage() }, "Previous"),
        React.createElement("span", null,
            "Page ",
            pagination.pageIndex + 1,
            " of",
            ' ',
            table.getPageCount()),
        React.createElement("button", { type: "button", disabled: !table.getCanNextPage(), onClick: () => table.nextPage() }, "Next"),
        React.createElement("label", null,
            "Rows:",
            ' ',
            React.createElement("select", { value: pagination.pageSize, onChange: event => table.setPageSize(Number(event.target.value)) },
                React.createElement("option", { value: 10 }, "10"),
                React.createElement("option", { value: 25 }, "25"),
                React.createElement("option", { value: 50 }, "50")))))));
}
/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */
const styles = {
    container: {
        width: '100%',
        padding: 24,
        boxSizing: 'border-box',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    search: {
        width: 280,
        padding: '8px 10px',
    },
    columnMenu: {
        display: 'grid',
        gap: 6,
        padding: 8,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: 10,
        borderBottom: '2px solid #ddd',
    },
    filterTh: {
        padding: '4px 6px 10px',
        borderBottom: '2px solid #ddd',
    },
    filterInput: {
        width: '100%',
        padding: '4px 6px',
        boxSizing: 'border-box',
        fontWeight: 'normal',
    },
    td: {
        padding: 10,
        borderBottom: '1px solid #eee',
    },
    empty: {
        padding: 32,
        textAlign: 'center',
    },
    pagination: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 16,
    },
};

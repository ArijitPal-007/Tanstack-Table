import * as React from 'react'
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type RowData,
  type Table,
} from '@tanstack/react-table'

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

export type Person = {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  active: boolean
}

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
})

type Features = typeof features

/* -------------------------------------------------------------------------- */
/* Table metadata                                                             */
/* -------------------------------------------------------------------------- */

const columnHelper =
  createColumnHelper<Features, Person>()

/* -------------------------------------------------------------------------- */
/* Columns                                                                    */
/* -------------------------------------------------------------------------- */

const columns: ColumnDef<Features, Person>[] =
  columnHelper.columns([
    /*
     * Selection
     */
    columnHelper.display({
      id: 'select',
      enableColumnFilter: false,

      header: ({ table }) => (
        <input
          type="checkbox"
          aria-label="Select all rows"
          checked={table.getIsAllRowsSelected()}
          ref={element => {
            if (element) {
              element.indeterminate =
                table.getIsSomeRowsSelected()
            }
          }}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),

      cell: ({ row }) => (
        <input
          type="checkbox"
          aria-label={`Select ${row.original.name}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          ref={element => {
            if (element) {
              element.indeterminate =
                row.getIsSomeSelected()
            }
          }}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
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
        const { pageIndex, pageSize } =
          table.state.pagination
        return pageIndex * pageSize + row.index + 1
      },
    }),

    /*
     * Name
     */
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <button
          type="button"
          onClick={column.getToggleSortingHandler()}
        >
          Name
          {column.getIsSorted() === 'asc' && ' ↑'}
          {column.getIsSorted() === 'desc' && ' ↓'}
        </button>
      ),

      cell: ({ getValue }) => getValue(),
    }),

    /*
     * Email
     */
    columnHelper.accessor('email', {
      header: ({ column }) => (
        <button
          type="button"
          onClick={column.getToggleSortingHandler()}
        >
          Email
          {column.getIsSorted() === 'asc' && ' ↑'}
          {column.getIsSorted() === 'desc' && ' ↓'}
        </button>
      ),

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

      cell: ({ getValue }) =>
        getValue() ? 'Yes' : 'No',

      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true
        return String(row.getValue(columnId)) === filterValue
      },
    }),
  ])

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

export type PeopleDataGridProps = {
  data: Person[]
}

/* -------------------------------------------------------------------------- */
/* Grid                                                                       */
/* -------------------------------------------------------------------------- */

export default function PeopleDataGrid({
  data,
}: PeopleDataGridProps) {
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

  const table = useTable(
    {
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
    }),
  )

  return (
    <div style={styles.container}>
      <Toolbar table={table} />

      <table style={styles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  scope="col"
                  style={styles.th}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}

          {/*
           * Per-column filter row. Reuses the same leaf headers as the
           * header row above so it stays aligned even as columns are
           * shown/hidden via the Columns menu.
           */}
          <tr>
            {table.getHeaderGroups()[0]?.headers.map(header => (
              <th
                key={`filter-${header.id}`}
                scope="col"
                style={styles.filterTh}
              >
                {header.column.getCanFilter() ? (
                  <ColumnFilter column={header.column} />
                ) : null}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={
                  table.getVisibleLeafColumns().length
                }
                style={styles.empty}
              >
                No results
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                data-selected={
                  row.getIsSelected() || undefined
                }
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={styles.td}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination table={table} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Column filter input                                                       */
/* -------------------------------------------------------------------------- */

function ColumnFilter({
  column,
}: {
  column: Column<Features, Person, unknown>
}) {
  const filterValue = column.getFilterValue()

  // Boolean "active" column gets a select instead of free text, since
  // the values are Yes/No rather than searchable text.


  return (
    <input
      type="text"
      aria-label={`Filter ${column.id}`}
      placeholder="Filter..."
      value={(filterValue as string) ?? ''}
      onChange={event =>
        column.setFilterValue(event.target.value || undefined)
      }
      style={styles.filterInput}
    />
  )
}

/* -------------------------------------------------------------------------- */
/* Toolbar                                                                    */
/* -------------------------------------------------------------------------- */

function Toolbar({
  table,
}: {
  table: Table<Features, Person>
}) {
  return (
    <div style={styles.toolbar}>
      <input
        type="search"
        placeholder="Search people..."
        value={table.state.globalFilter ?? ''}
        onChange={event =>
          table.setGlobalFilter(event.target.value)
        }
        style={styles.search}
      />

      <details>
        <summary>Columns</summary>

        <div style={styles.columnMenu}>
          {table.getAllLeafColumns().map(column => (
            <label key={column.id}>
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />{' '}
              {column.id}
            </label>
          ))}
        </div>
      </details>

      <ClearFiltersButton table={table} />

      <SelectedCount table={table} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Clear filters                                                             */
/* -------------------------------------------------------------------------- */

function ClearFiltersButton({
  table,
}: {
  table: Table<Features, Person>
}) {
  return (
    <table.Subscribe
      selector={state => state.columnFilters}
    >
      {columnFilters => (
        <button
          type="button"
          onClick={() => table.resetColumnFilters()}
          disabled={columnFilters.length === 0}
        >
          Clear filters
        </button>
      )}
    </table.Subscribe>
  )
}

/* -------------------------------------------------------------------------- */
/* Reactive state example                                                     */
/* -------------------------------------------------------------------------- */

function SelectedCount({
  table,
}: {
  table: Table<Features, Person>
}) {
  /*
   * This component subscribes only to rowSelection.
   *
   * table.Subscribe is the v9 Store-backed reactive API.
   */
  return (
    <table.Subscribe
      selector={state => state.rowSelection}
    >
      {rowSelection => (
        <span>
          {Object.keys(rowSelection).length} selected
        </span>
      )}
    </table.Subscribe>
  )
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

function Pagination({
  table,
}: {
  table: Table<Features, Person>
}) {
  return (
    <table.Subscribe
      selector={state => state.pagination}
    >
      {pagination => (
        <nav
          aria-label="People pagination"
          style={styles.pagination}
        >
          <button
            type="button"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </button>

          <span>
            Page {pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>

          <button
            type="button"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </button>

          <label>
            Rows:{' '}
            <select
              value={pagination.pageSize}
              onChange={event =>
                table.setPageSize(
                  Number(event.target.value),
                )
              }
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
        </nav>
      )}
    </table.Subscribe>
  )
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles: Record<string, React.CSSProperties> = {
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
}
export function exportTableToCSV(table) {
    // Get only columns currently visible
    const visibleColumns = table.getVisibleLeafColumns();
    // Get rows currently displayed by the table
    const rows = table.getRowModel().rows;
    // Convert values safely for CSV
    const escapeCSV = (value) => {
        if (value === null || value === undefined) {
            return "";
        }
        const text = String(value);
        return `"${text.replace(/"/g, '""')}"`;
    };
    // Get column names
    const headers = visibleColumns.map((column) => {
        if (typeof column.columnDef.header === "string") {
            return column.columnDef.header;
        }
        return column.id;
    });
    // Create data rows
    const dataRows = rows.map((row) => {
        return visibleColumns.map((column) => {
            // Your ID column is a display column,
            // so get the real ID from the original data.
            if (column.id === "ID") {
                return escapeCSV(row.original.id);
            }
            return escapeCSV(row.getValue(column.id));
        });
    });
    // Build CSV
    const csv = [
        headers.map(escapeCSV).join(","),
        ...dataRows.map((row) => row.join(",")),
    ].join("\r\n");
    // BOM helps Excel correctly recognize UTF-8
    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
    });
    // Create download URL
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employee-assessments.csv";
    // Important for browser download
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

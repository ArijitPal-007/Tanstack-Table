export function AggregationFooter({ table, aggregations }) {
    const columns = table.getVisibleLeafColumns();
    const rows = table.getRowModel().rows;
    const activeColumns = columns.filter(column => aggregations[column.id]);
    if (activeColumns.length === 0)
        return null;
    return (React.createElement("tr", { className: "border-t bg-muted font-semibold" }, columns.map(column => {
        const aggregation = aggregations[column.id];
        if (!aggregation) {
            return React.createElement("td", { key: column.id });
        }
        const values = rows
            .map(row => row.getValue(column.id))
            .filter(value => typeof value === "number");
        if (values.length === 0) {
            return React.createElement("td", { key: column.id });
        }
        const result = aggregation === "sum"
            ? values.reduce((total, value) => total + value, 0)
            : values.reduce((total, value) => total + value, 0) /
                values.length;
        return (React.createElement("td", { key: column.id, className: "max-w-0 px-1 py-2 font-normal", title: `${aggregation === "sum" ? "Sum" : "Avg"}: ${result.toFixed(2)}` },
            React.createElement("span", { className: "block truncate" }, aggregation === "sum"
                ? `Sum: ${result.toFixed(2)}`
                : `Avg: ${result.toFixed(2)}`)));
    })));
}

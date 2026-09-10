import React from "react";
export function DetailRow({ row, table }) {
    const tasks = row.original.details?.inProcessTasks ?? [];
    return (React.createElement("tr", null,
        React.createElement("td", { colSpan: table.getVisibleLeafColumns().length, className: "bg-muted/20 p-0" },
            React.createElement("div", { className: "ml-10 my-2 overflow-hidden rounded-md border" },
                React.createElement("table", { className: "w-full" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "bg-[#092244] text-white" },
                            React.createElement("th", { className: "px-3 py-2 text-left" }, "In-process Tasks"),
                            React.createElement("th", { className: "px-3 py-2 text-left" }, "Group"),
                            React.createElement("th", { className: "px-3 py-2 text-left" }, "User"),
                            React.createElement("th", { className: "px-3 py-2 text-left" }, "Start Time"))),
                    React.createElement("tbody", null, tasks.length > 0 ? (tasks.map((task, index) => (React.createElement("tr", { key: index, className: "border-t" },
                        React.createElement("td", { className: "px-3 py-2" }, task.task),
                        React.createElement("td", { className: "px-3 py-2" }, task.group),
                        React.createElement("td", { className: "px-3 py-2" }, task.user),
                        React.createElement("td", { className: "px-3 py-2" }, task.startTime))))) : (React.createElement("tr", null,
                        React.createElement("td", { colSpan: 4, className: "py-4 text-center text-muted-foreground" }, "No data to display")))))))));
}

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataGrid } from "@/components/data-grid/data-grid";
import { AssessmentDetail } from "@/pages/assessment-detail";
import { people } from "@/components/data-grid/data-grid-data";
export default function App() {
    return (React.createElement(BrowserRouter, null,
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(DataGrid, { data: people }) }),
            React.createElement(Route, { path: "/assessment/:id", element: React.createElement(AssessmentDetail, null) }))));
}

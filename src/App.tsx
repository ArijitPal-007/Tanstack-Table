import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DataGrid } from "@/components/data-grid/data-grid"
import { AssessmentDetail } from "@/pages/assessment-detail"
import { people } from "@/components/data-grid/data-grid-data"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={        <DataGrid data={people} />} />
        <Route path="/assessment/:id" element={<AssessmentDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
export type InProcessTask = {
  task: string
  group: string
  user: string
  startTime: string
}

export type Person = {
  id: string
  appraiserName: string
  assessmentYear: string
  employeeName: string
  assessmentType: string
  initiationTime: string
  role: string
  employeeId: string
  lastUpdatedDate: string
  subRows?: Person[]
   emoji: string
  decimal: number
  number: number
  currency: number
   details?: {
    inProcessTasks: InProcessTask[]
  }
}



export type DataGridColumnMeta = {
  filterVariant?: "text" | "facet" | "date"
}
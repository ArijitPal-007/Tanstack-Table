import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { people } from "@/components/data-grid/data-grid-data"

export function AssessmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const person = people.find((item) => item.id === id)

  if (!person) {
    return (
      <div className="p-6">
        <p>Assessment not found.</p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft />
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </Button>

        <div>
          <h1 className="text-2xl font-semibold">
            Assessment Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Assessment ID: {person.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border p-6">
        <Detail label="Appraiser Name" value={person.appraiserName} />
        <Detail label="Employee Name" value={person.employeeName} />
        <Detail label="Assessment Year" value={person.assessmentYear} />
        <Detail label="Assessment Type" value={person.assessmentType} />
        <Detail label="Initiation Time" value={person.initiationTime} />
        <Detail label="Role" value={person.role} />
        <Detail label="Employee ID" value={person.employeeId} />
        <Detail label="Last Updated" value={person.lastUpdatedDate} />
        <Detail label="Emoji" value={person.emoji} />
        <Detail label="Decimal" value={String(person.decimal)} />
        <Detail label="Number" value={String(person.number)} />
        <Detail label="Currency" value={`$${person.currency}`} />
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Extra Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Detail label="Status" value="Completed" />
          <Detail label="Review Status" value="Pending Review" />
          <Detail label="Location" value="India" />
        </div>
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
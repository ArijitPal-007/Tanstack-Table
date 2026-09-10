import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { people } from "@/components/data-grid/data-grid-data";
export function AssessmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const person = people.find((item) => item.id === id);
    if (!person) {
        return (React.createElement("div", { className: "p-6" },
            React.createElement("p", null, "Assessment not found."),
            React.createElement(Button, { onClick: () => navigate("/") },
                React.createElement(ArrowLeft, null),
                "Back")));
    }
    return (React.createElement("div", { className: "space-y-6 p-6" },
        React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement(Button, { variant: "outline", size: "icon", onClick: () => navigate(-1) },
                React.createElement(ArrowLeft, null)),
            React.createElement("div", null,
                React.createElement("h1", { className: "text-2xl font-semibold" }, "Assessment Details"),
                React.createElement("p", { className: "text-sm text-muted-foreground" },
                    "Assessment ID: ",
                    person.id))),
        React.createElement("div", { className: "grid grid-cols-2 gap-4 rounded-lg border p-6" },
            React.createElement(Detail, { label: "Appraiser Name", value: person.appraiserName }),
            React.createElement(Detail, { label: "Employee Name", value: person.employeeName }),
            React.createElement(Detail, { label: "Assessment Year", value: person.assessmentYear }),
            React.createElement(Detail, { label: "Assessment Type", value: person.assessmentType }),
            React.createElement(Detail, { label: "Initiation Time", value: person.initiationTime }),
            React.createElement(Detail, { label: "Role", value: person.role }),
            React.createElement(Detail, { label: "Employee ID", value: person.employeeId }),
            React.createElement(Detail, { label: "Last Updated", value: person.lastUpdatedDate }),
            React.createElement(Detail, { label: "Emoji", value: person.emoji }),
            React.createElement(Detail, { label: "Decimal", value: String(person.decimal) }),
            React.createElement(Detail, { label: "Number", value: String(person.number) }),
            React.createElement(Detail, { label: "Currency", value: `$${person.currency}` })),
        React.createElement("div", { className: "rounded-lg border p-6" },
            React.createElement("h2", { className: "mb-4 text-lg font-semibold" }, "Extra Details"),
            React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                React.createElement(Detail, { label: "Status", value: "Completed" }),
                React.createElement(Detail, { label: "Review Status", value: "Pending Review" }),
                React.createElement(Detail, { label: "Location", value: "India" })))));
}
function Detail({ label, value, }) {
    return (React.createElement("div", null,
        React.createElement("p", { className: "text-sm text-muted-foreground" }, label),
        React.createElement("p", { className: "font-medium" }, value)));
}

interface OnboardingStatusBadgeProps {
    status: string
}

export function OnboardingStatusBadge({ status }: OnboardingStatusBadgeProps) {
    const getStyle = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "in_progress":
                return "bg-blue-100 text-blue-800"
            case "complete":
                return "bg-green-100 text-green-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStyle(status)}`}>
            {status.replaceAll("_", " ")}
        </span>
    )
}

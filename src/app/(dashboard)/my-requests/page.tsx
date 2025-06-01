"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { toast, Toaster } from "sonner"
import { Badge } from "@/components/ui/badge"

interface OnboardingRequest {
    request_id: string
    application_name: string
    employee_id: string
    employee_name: string
    employee_email: string
    status: string
    role_name: string
    role_id: string

}

function getStatusStyle(status: string) {
    switch (status) {
        case "requested":
            return "bg-yellow-100 text-yellow-800"
        case "complete":
            return "bg-green-100 text-green-800"
        case "denied":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<OnboardingRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [completing, setCompleting] = useState<string | null>(null)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await api.get<OnboardingRequest[]>("/onboarding/requests/contact?status=requested")
                setRequests(data)
            } catch (err) {
                console.error("Failed to fetch requests:", err)
                toast.error("Failed to fetch requests")
            } finally {
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    const handleComplete = async (requestId: string) => {
        setCompleting(requestId)
        try {
            await api.get(`/onboarding/requests/${requestId}/confirm`)
            setRequests(prev => prev.map(req => req.request_id === requestId ? { ...req, status: "complete" } : req))
            toast.success("Request marked as complete")
        } catch (err) {
            console.error("Failed to complete request:", err)
            toast.error("Failed to complete request")
        } finally {
            setCompleting(null)
        }
    }

    return (
        <>

            <Toaster />
            <div className="max-w-5xl mx-auto py-10 space-y-8">
                <h1 className="text-3xl font-bold">Access Requests</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Requests Needing Attention</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading requests...
                            </div>
                        ) : requests.length === 0 ? (
                            <p className="text-muted-foreground">No requests to attend to currently.</p>
                        ) : (
                            <div className="grid gap-4">
                                {requests.map(req => (
                                    <div
                                        key={req.request_id}
                                        className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted transition-colors"
                                    >
                                        <div>
                                            <div className="font-semibold">{req.application_name}</div>
                                            <div className="text-sm text-muted-foreground"><Link
                                                href={`/employees/${req.employee_id}`}
                                                className="font-semibold text-blue-600 hover:underline"
                                            >
                                                {req.employee_name} ({req.employee_email})
                                            </Link></div>
                                            <div className="text-sm mt-1">Role: <Link
                                                href={`/roles/${req.role_id}`}
                                                className="font-semibold text-blue-600 hover:underline"
                                            >
                                                {req.role_name}
                                            </Link></div>
                                            <div className="text-sm mt-1">Status: <Badge className={getStatusStyle(req.status)}>{req.status}</Badge></div>
                                        </div>
                                        <div>
                                            {req.status !== "complete" && (
                                                <Button
                                                    size="sm"
                                                    disabled={completing === req.request_id}
                                                    onClick={() => handleComplete(req.request_id)}
                                                >
                                                    {completing === req.request_id ? (
                                                        <><Loader2 className="w-3 h-3 animate-spin mr-2" /> Completing...</>
                                                    ) : (
                                                        "Complete Request"
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

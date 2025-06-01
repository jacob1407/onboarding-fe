"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Employee {
    id: string
    first_name: string
    last_name: string
    email: string
    onboarding_status: "pending" | "in_progress" | "complete"
}

export default function AdminDashboard() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await api.get<Employee[]>("/users/employees")
                setEmployees(data)
            } catch (err) {
                console.error("Failed to fetch employees:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchEmployees()
    }, [])

    const inProgress = employees.filter(e => e.onboarding_status === "in_progress")
    const completed = employees.filter(e => e.onboarding_status === "complete")

    const statusBadge = (status: Employee["onboarding_status"]) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case "in_progress":
                return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
            case "complete":
                return <Badge className="bg-green-100 text-green-800">Completed</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading onboarding summary...
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-1">Onboarding Dashboard</h1>
                <p className="text-muted-foreground text-sm">Track progress of employees currently onboarding and review completed onboarding sessions.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Currently Onboarding</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {inProgress.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No employees currently onboarding.</p>
                        ) : (
                            inProgress.map(emp => (
                                <div
                                    key={emp.id}
                                    className="flex items-center justify-between border rounded-md p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div>
                                        <div className="font-medium">{emp.first_name} {emp.last_name}</div>
                                        <div className="text-sm text-muted-foreground">{emp.email}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {statusBadge(emp.onboarding_status)}
                                        <Link href={`/employees/${emp.id}`}><Button size="sm" variant="outline">View</Button></Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Recently Completed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {completed.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No completed onboardings yet.</p>
                        ) : (
                            completed.map(emp => (
                                <div
                                    key={emp.id}
                                    className="flex items-center justify-between border rounded-md p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div>
                                        <div className="font-medium">{emp.first_name} {emp.last_name}</div>
                                        <div className="text-sm text-muted-foreground">{emp.email}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {statusBadge(emp.onboarding_status)}
                                        <Link href={`/employees/${emp.id}`}><Button size="sm" variant="outline">View</Button></Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

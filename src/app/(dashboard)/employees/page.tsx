"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { toast, Toaster } from "sonner"
import { api } from "@/lib/api"
import { OnboardingStatusBadge } from "@/components/ui/onboardingStatusBadge"

interface Role {
    id: string
    name: string
    code: string
    description: string | null
}

interface Employee {
    id: string
    first_name: string
    last_name: string
    email: string
    username: string
    status: string
    type: string
    organisation_id: string
    role: Role
    onboarding_status: string
}

export default function EmployeesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [startingId, setStartingId] = useState<string | null>(null)

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

    useEffect(() => {
        if (searchParams.get("created") === "true") {
            toast.success("Employee created successfully")
            router.replace("/employees", { scroll: false })
        }
    }, [searchParams, router])

    const handleStartOnboarding = async (userId: string) => {
        setStartingId(userId)
        try {
            await api.post(`/onboarding/start`, { user_id: userId })
            toast.success("Onboarding started successfully")
            setEmployees(prev =>
                prev.map(e =>
                    e.id === userId ? { ...e, onboarding_status: "in_progress" } : e
                )
            )
        } catch (err) {
            console.error("Failed to start onboarding:", err)
            toast.error("Failed to start onboarding")
        } finally {
            setStartingId(null)
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-8">
            <Toaster />
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">Employees</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your organisation's employees.</p>
                </div>
                <Link href="/employees/create">
                    <Button>Create Employee</Button>
                </Link>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Current Employees</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading employees...
                        </div>
                    ) : employees.length === 0 ? (
                        <p className="text-muted-foreground">No employees found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {employees.map(emp => (
                                <div
                                    key={emp.id}
                                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={undefined} />
                                            <AvatarFallback>
                                                {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-base">
                                                {emp.first_name} {emp.last_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{emp.email}</div>
                                            <div className="text-sm mt-1">
                                                <strong>Role:</strong> {emp.role.name} — {emp.role.description ?? "No description"}
                                            </div>
                                            <div className="text-sm mt-1 flex items-center gap-2">
                                                <strong>Onboarding Status:</strong>
                                                <OnboardingStatusBadge status={emp.onboarding_status} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/employees/${emp.id}`}>
                                            <Button variant="outline" size="sm">View</Button>
                                        </Link>
                                        {emp.onboarding_status === "pending" && (
                                            <Button
                                                size="sm"
                                                disabled={startingId === emp.id}
                                                onClick={() => handleStartOnboarding(emp.id)}
                                            >
                                                {startingId === emp.id ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                                        Starting...
                                                    </>
                                                ) : (
                                                    "Start Onboarding"
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
    )
}

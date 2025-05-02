"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface Employee {
    id: string
    first_name: string
    last_name: string
    email: string
    username: string
    status: "invited" | "active" | "inactive" | "archived"
    type: "admin" | "employee"
    organisation_id: string
}

export default function EmployeesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await api.get<Employee[]>(`/users?user_type=employee`)
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

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">Employees</h1>
                    <p className="text-muted-foreground text-sm mt-1">View all users with the role of employee.</p>
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
                                            <div className="text-sm text-muted-foreground">Username: {emp.username}</div>
                                            <div className="text-sm text-muted-foreground">Status: {emp.status}</div>
                                            <div className="text-sm text-muted-foreground">Type: {emp.type}</div>
                                        </div>
                                    </div>
                                    <Link href={`/employees/${emp.id}`}>
                                        <Button variant="outline" size="sm">View</Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

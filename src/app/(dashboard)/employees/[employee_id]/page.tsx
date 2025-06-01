"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Pencil, Save } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import { OnboardingStatusBadge } from "@/components/ui/onboardingStatusBadge"

interface Role {
    id: string
    name: string
    description: string
}

interface OnboardingRequest {
    id: string
    application_name: string
    application_description: string | null
    application_id: string
    status: string
    acknowledged_at: string | null
    completed_at: string | null
}

interface Employee {
    id: string
    first_name: string
    last_name: string
    email: string
    username: string
    organisation_id: string
    type: "employee"
    status: "active" | "inactive" | "invited" | "archived"
    onboarding_status: "pending" | "in_progress" | "completed"
    role: Role
}

export default function ViewEmployeePage() {
    const { employee_id } = useParams()
    const router = useRouter()
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [requests, setRequests] = useState<OnboardingRequest[]>([])
    const [availableRoles, setAvailableRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [successfullyUpdated, setSuccessfullyUpdated] = useState(false)

    useEffect(() => {
        if (successfullyUpdated) {
            toast.success("Employee updated successfully")
            setSuccessfullyUpdated(false)
        }
    }, [successfullyUpdated])

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const data = await api.get<Employee>(`/users/employees/${employee_id}`)
                setEmployee(data)

                const reqs = await api.get<OnboardingRequest[]>(`/onboarding/requests/employee/${employee_id}`)
                setRequests(reqs)
            } catch (err) {
                console.error("Failed to fetch employee:", err)
            } finally {
                setLoading(false)
            }
        }

        const fetchRoles = async () => {
            try {
                const roles = await api.get<Role[]>(`/roles`)
                setAvailableRoles(roles)
            } catch (err) {
                console.error("Failed to fetch roles:", err)
            }
        }

        fetchEmployee()
        fetchRoles()
    }, [employee_id])

    const handleSave = async () => {
        if (!employee) return

        try {
            setSaving(true)

            const payload = {
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                username: employee.username,
                type: "employee",
                role_id: employee.role.id,
            }

            const updated = await api.put<Employee>(`/users/employees/${employee_id}`, payload)
            setEmployee(updated)
            setEditMode(false)
            setSaving(false)
            setSuccessfullyUpdated(true)
        } catch (err) {
            console.error("Failed to update employee:", err)
            toast.error("Failed to update employee.")
        }
    }

    if (loading || saving) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> {saving ? "Saving changes..." : "Loading employee details..."}
            </div>
        )
    }

    if (!employee) {
        return <div className="text-center text-muted-foreground">Employee not found.</div>
    }

    const statusColor = {
        active: "bg-green-100 text-green-800",
        invited: "bg-blue-100 text-blue-800",
        inactive: "bg-gray-100 text-gray-800",
        archived: "bg-red-100 text-red-800",
    }[employee.status]

    const requestStatusColor = (status: string) => {
        switch (status) {
            case "requested":
                return "bg-blue-100 text-blue-800"
            case "complete":
                return "bg-green-100 text-green-800"
            case "denied":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <Toaster />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Employee Details</h1>
                <div className="flex gap-3">
                    <Link href="/employees">
                        <Button variant="outline">Back</Button>
                    </Link>
                    <Button onClick={() => (editMode ? handleSave() : setEditMode(true))}>
                        {editMode ? <><Save className="w-4 h-4 mr-2" /> Save</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <Card className="shadow-sm">
                        <CardContent className="py-8 px-6 space-y-6">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={undefined} />
                                    <AvatarFallback>
                                        {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-xl font-semibold">
                                    {employee.first_name} {employee.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>

                            <div className="border-t pt-6 grid gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1">First Name</label>
                                    <Input
                                        value={employee.first_name}
                                        disabled={!editMode}
                                        onChange={(e) => setEmployee(prev => prev ? { ...prev, first_name: e.target.value } : prev)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Name</label>
                                    <Input
                                        value={employee.last_name}
                                        disabled={!editMode}
                                        onChange={(e) => setEmployee(prev => prev ? { ...prev, last_name: e.target.value } : prev)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <Input
                                        value={employee.email}
                                        disabled={!editMode}
                                        onChange={(e) => setEmployee(prev => prev ? { ...prev, email: e.target.value } : prev)}
                                        type="email"
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6 grid gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Account Status</span>
                                    <Badge className={statusColor}>{employee.status}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Onboarding Status</span>
                                    <OnboardingStatusBadge status={employee.onboarding_status} />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <div className="text-sm font-medium text-muted-foreground mb-2">Role</div>
                                {editMode ? (
                                    <div className="grid gap-3">
                                        {availableRoles.map(role => (
                                            <div
                                                key={role.id}
                                                className={`flex items-center justify-between border rounded-md p-4 hover:bg-muted transition-colors cursor-pointer ${employee.role.id === role.id ? "border-primary" : ""}`}
                                                onClick={() => setEmployee(prev => prev ? { ...prev, role } : prev)}
                                            >
                                                <div>
                                                    <div className="font-semibold">{role.name}</div>
                                                    <div className="text-sm text-muted-foreground">{role.description || "No description."}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 border rounded-md">
                                        <Link
                                            href={`/roles/${employee.role.id}`}
                                            className="font-semibold text-blue-600 hover:underline"
                                        >
                                            {employee.role.name}
                                        </Link>
                                        <div className="text-sm text-muted-foreground">{employee.role.description || "No description."}</div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests">
                    <Card className="shadow-sm">
                        <CardContent className="py-8 px-6 space-y-4">
                            {requests.length > 0 ? (
                                requests.map(req => (
                                    <div
                                        key={req.id}
                                        className="flex justify-between items-center border rounded-md p-4"
                                    >
                                        <div>
                                            <Link
                                                href={`/applications/${req.application_id}`}
                                                className="font-semibold text-blue-600 hover:underline"
                                            >
                                                {req.application_name}
                                            </Link>
                                            <div className="text-sm text-muted-foreground">
                                                {req.application_description || "No description."}
                                            </div>
                                        </div>
                                        <Badge className={requestStatusColor(req.status)}>{req.status.replace("_", " ")}</Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-sm">No onboarding requests currently.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

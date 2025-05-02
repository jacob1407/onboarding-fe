"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Pencil, Save } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import { ORG_ID } from "@/lib/constants"

interface Role {
    id: string
    name: string
    description: string
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
    role: Role
}

export default function ViewEmployeePage() {
    const { employee_id } = useParams()
    const router = useRouter()
    const [employee, setEmployee] = useState<Employee | null>(null)
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
            } catch (err) {
                console.error("Failed to fetch employee:", err)
            } finally {
                setLoading(false)
            }
        }

        const fetchRoles = async () => {
            try {
                const roles = await api.get<Role[]>(`/roles?organisation_id=${ORG_ID}`)
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
                organisation_id: employee.organisation_id,
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

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <Toaster />
            <div className="flex items-center justify-between">
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

            <div className="flex items-center justify-center">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={undefined} />
                    <AvatarFallback>
                        {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Role Info</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {editMode ? (
                        availableRoles.map(role => (
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
                        ))
                    ) : (
                        <div className="flex items-center justify-between border rounded-md p-4">
                            <div>
                                <div className="font-semibold">{employee.role.name}</div>
                                <div className="text-sm text-muted-foreground">{employee.role.description || "No description."}</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

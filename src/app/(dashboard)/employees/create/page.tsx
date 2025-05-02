"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { ORG_ID } from "@/lib/constants"
import { toast } from "sonner"
import Link from "next/link"

interface Role {
    id: string
    name: string
    description: string
}

export default function CreateEmployeePage() {
    const router = useRouter()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [selectedRoleId, setSelectedRoleId] = useState<string>("")
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await api.get<Role[]>(`/roles?organisation_id=${ORG_ID}`)
                setRoles(data)
            } catch (err) {
                console.error("Failed to fetch roles:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchRoles()
    }, [])

    const handleCreate = async () => {
        if (!firstName || !lastName || !email || !selectedRoleId) {
            toast.error("Please fill in all fields.")
            return
        }

        try {
            setSaving(true)
            await api.post("/users/employees", {
                first_name: firstName,
                last_name: lastName,
                email,
                username: email, // using email as username
                type: "employee",
                role_id: selectedRoleId,
                organisation_id: ORG_ID,
            })
            router.push("/employees?created=true")
        } catch (err) {
            console.error("Failed to create employee:", err)
            toast.error("Failed to create employee.")
        } finally {
            setSaving(false)
        }
    }

    if (loading || saving) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> {saving ? "Creating employee..." : "Loading roles..."}
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create Employee</h1>
                <Link href="/employees">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Employee Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Assign Role</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {roles.map(role => (
                        <div
                            key={role.id}
                            className={`flex items-center justify-between border rounded-md p-4 hover:bg-muted transition-colors cursor-pointer ${selectedRoleId === role.id ? "border-primary" : ""}`}
                            onClick={() => setSelectedRoleId(role.id)}
                        >
                            <div>
                                <div className="font-semibold">{role.name}</div>
                                <div className="text-sm text-muted-foreground">{role.description || "No description."}</div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Button className="w-full" onClick={handleCreate}>
                Create Employee
            </Button>
        </div>
    )
}

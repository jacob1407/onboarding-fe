"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"

export default function CreateUserPage() {
    const router = useRouter()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [userType, setUserType] = useState("employee")
    const [saving, setSaving] = useState(false)

    const handleCreate = async () => {
        if (!firstName || !lastName || !email) {
            toast.error("Please fill in all fields.")
            return
        }

        try {
            setSaving(true)

            await api.post("/auth/invite", {
                first_name: firstName,
                last_name: lastName,
                email,
                user_type: userType.toLowerCase(),
            })

            router.push("/users")
            toast.success("User invited successfully")
        } catch (err) {
            console.error("Failed to invite user:", err)
            toast.error("Failed to invite user.")
        } finally {
            setSaving(false)
        }
    }

    if (saving) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Creating user...
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create User</h1>
                <Link href="/users">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">User Info</CardTitle>
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

                    <div>
                        <label className="block text-sm font-medium mb-1">User Type</label>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="w-full p-2 border rounded text-sm"
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={handleCreate}>
                Create User
            </Button>
        </div>
    )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useOrgApplications } from "@/hooks/useOrgApplications"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"


export default function CreateRolePage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedApps, setSelectedApps] = useState<string[]>([])
    const { applications: applicationOptions, loading } = useOrgApplications()
    const [submitting, setSubmitting] = useState(false)

    const toggleApp = (id: string) => {
        setSelectedApps(prev =>
            prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
        )
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true)
            const payload = {
                name,
                description,
                application_ids: selectedApps
            }
            await api.post("/roles", payload)
            router.push("/roles?created=true")
        } catch (err) {
            console.error("Failed to create role:", err)
            alert("Failed to create role")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading role setup...
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Role</h1>
                <Link href="/roles">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Role Details</CardTitle>
                    <CardDescription>
                        Provide a name, description, and select the applications this role should have access to.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Engineering Manager"
                            disabled={submitting}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Description</Label>
                        <Textarea
                            value={description ?? ""}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Briefly describe this role’s purpose or scope."
                            disabled={submitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Applications</Label>
                        <div className="grid gap-3">
                            {applicationOptions.map(app => (
                                <label
                                    key={app.id}
                                    className="flex items-center gap-3 p-2 border rounded-md hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedApps.includes(app.id)}
                                        onChange={() => toggleApp(app.id)}
                                        disabled={submitting}
                                    />
                                    <div>
                                        <div className="font-medium">{app.name}</div>
                                        <div className="text-sm text-muted-foreground">{app.code}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Create Role
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Pencil, Save } from "lucide-react"
import { ORG_ID } from "@/lib/constants"
import { toast, Toaster } from "sonner"

interface Application {
    id: string
    name: string
    code: string
}

interface Role {
    id: string
    name: string
    description: string
    organisation_id: string
    applications: Application[]
}

export default function ViewRolePage() {
    const { role_id } = useParams()
    const [role, setRole] = useState<Role | null>(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedApps, setSelectedApps] = useState<string[]>([])
    const [availableApps, setAvailableApps] = useState<Application[]>([])
    const [successfullyUpdated, setSuccessfullyUpdated] = useState(false)

    useEffect(() => {
        if (successfullyUpdated) {
            toast.success("Role updated successfully")
            setSuccessfullyUpdated(false)
        }
    }, [successfullyUpdated])

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const data = await api.get<Role>(`/roles/${role_id}`)
                setRole(data)
                setName(data.name)
                setDescription(data.description)
                setSelectedApps(data.applications.map(app => app.id))
            } catch (err) {
                console.error("Failed to fetch role:", err)
            } finally {
                setLoading(false)
            }
        }

        const fetchApplications = async () => {
            try {
                const apps = await api.get<Application[]>("/applications?organisation_id=a65e7da5-8145-4d96-a787-a45cfa42c9c3")
                setAvailableApps(apps)
            } catch (err) {
                console.error("Failed to fetch applications:", err)
            }
        }

        fetchRole()
        fetchApplications()
    }, [role_id])

    const handleSave = async () => {
        try {
            setLoading(true)
            const payload = {
                name,
                description,
                application_ids: selectedApps,
                organisation_id: ORG_ID
            }
            const updated = await api.put<Role>(`/roles/${role_id}`, payload)
            setRole(updated)
            setEditMode(false)
            setSuccessfullyUpdated(true)
        } catch (err) {
            console.error("Failed to update role:", err)
            alert("Failed to save changes")
        } finally {
            setLoading(false)
        }
    }

    const toggleApp = (id: string) => {
        setSelectedApps(prev =>
            prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading role details...
            </div>
        )
    }

    if (!role) {
        return <div className="text-center text-muted-foreground">Role not found.</div>
    }

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-6">
            <Toaster />
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Role Details</h1>
                <div className="flex gap-3">
                    <Link href="/roles">
                        <Button variant="outline">Back</Button>
                    </Link>
                    <Button onClick={() => (editMode ? handleSave() : setEditMode(true))}>
                        {editMode ? <><Save className="w-4 h-4 mr-2" /> Save</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">General Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                            value={name}
                            disabled={!editMode}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea
                            value={description ?? ""}
                            disabled={!editMode}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Applications</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                    {editMode ? (
                        availableApps.map(app => (
                            <label key={app.id} className="flex items-center gap-3 border rounded-md p-2 hover:bg-muted">
                                <input
                                    type="checkbox"
                                    checked={selectedApps.includes(app.id)}
                                    onChange={() => toggleApp(app.id)}
                                />
                                <div>
                                    <div className="font-medium">{app.name}</div>
                                    <div className="text-sm text-muted-foreground">{app.code}</div>
                                </div>
                            </label>
                        ))
                    ) : !role.applications || role.applications.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No applications assigned.</p>
                    ) : (
                        role.applications.map(app => (
                            <div
                                key={app.id}
                                className="flex items-center justify-between border rounded-md px-4 py-2 hover:bg-muted/50"
                            >
                                <div>
                                    <div className="font-medium">{app.name}</div>
                                    <div className="text-sm text-muted-foreground">{app.code}</div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Pencil, Save } from "lucide-react"
import { api } from "@/lib/api"
import { toast, Toaster } from "sonner"
import Link from "next/link"
import { ORG_ID } from "@/lib/constants"

interface Contact {
    id: string
    first_name: string
    last_name: string
    email: string
}

interface Application {
    id: string
    name: string
    description: string
    contacts: Contact[]
}

export default function ViewApplicationPage() {
    const { application_id } = useParams()
    const router = useRouter()
    const [app, setApp] = useState<Application | null>(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedContacts, setSelectedContacts] = useState<string[]>([])
    const [availableContacts, setAvailableContacts] = useState<Contact[]>([])

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const data = await api.get<Application>(`/applications/${application_id}`)
                setApp(data)
                setName(data.name)
                setDescription(data.description ?? "")
                setSelectedContacts(data.contacts.map(c => c.id))
            } catch (err) {
                console.error("Failed to fetch application:", err)
            } finally {
                setLoading(false)
            }
        }

        const fetchContacts = async () => {
            try {
                const contacts = await api.get<Contact[]>(`/contacts?organisation_id=a65e7da5-8145-4d96-a787-a45cfa42c9c3`)
                setAvailableContacts(contacts)
            } catch (err) {
                console.error("Failed to fetch contacts:", err)
            }
        }

        fetchApp()
        fetchContacts()
    }, [application_id])

    const toggleContact = (id: string) => {
        setSelectedContacts(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const handleSave = async () => {
        try {
            const payload = {
                name,
                description,
                organisation_id: ORG_ID,
                contact_ids: selectedContacts
            }
            const updated = await api.put<Application>(`/applications/${application_id}`, payload)
            setApp(updated)
            setEditMode(false)
            toast.success("Application updated successfully")
        } catch (err) {
            console.error("Failed to update application:", err)
            alert("Failed to update application")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading application details...
            </div>
        )
    }

    if (!app) {
        return <div className="text-center text-muted-foreground">Application not found.</div>
    }

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-6">
            <Toaster />
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Application Details</h1>
                <div className="flex gap-3">
                    <Link href="/applications">
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
                            value={description}
                            disabled={!editMode}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Contacts</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                    {editMode ? (
                        availableContacts.map(contact => (
                            <label
                                key={contact.id}
                                className="flex items-center gap-3 border rounded-md p-2 hover:bg-muted"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedContacts.includes(contact.id)}
                                    onChange={() => toggleContact(contact.id)}
                                />
                                <div>
                                    <div className="font-medium">{contact.first_name} {contact.last_name}</div>
                                    <div className="text-sm text-muted-foreground">{contact.email}</div>
                                </div>
                            </label>
                        ))
                    ) : app.contacts.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No contacts assigned.</p>
                    ) : (
                        app.contacts.map(contact => (
                            <div
                                key={contact.id}
                                className="flex flex-col sm:flex-row justify-between border rounded-md px-4 py-2 hover:bg-muted/50"
                            >
                                <div className="font-medium">{contact.first_name} {contact.last_name}</div>
                                <div className="text-sm text-muted-foreground">{contact.email}</div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
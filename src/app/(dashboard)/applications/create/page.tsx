"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

interface Contact {
    id: string
    first_name: string
    last_name: string
    email: string
}

export default function CreateApplicationPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [selectedContacts, setSelectedContacts] = useState<string[]>([])
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await api.get<Contact[]>(`/users?user_types=access_manager&user_types=admin`)
                setContacts(data)
            } catch (err) {
                console.error("Failed to fetch contacts:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchContacts()
    }, [])

    const toggleContact = (id: string) => {
        setSelectedContacts(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true)
            const payload = {
                name,
                description,
                contact_ids: selectedContacts
            }
            await api.post("/applications", payload)
            router.push("/applications?created=true")
        } catch (err) {
            console.error("Failed to create application:", err)
            alert("Failed to create application")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Application</h1>
                <Link href="/applications">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                    <CardDescription>
                        Provide a name, optional description, and assign contacts.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. GitHub Enterprise"
                            disabled={submitting}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this application used for?"
                            disabled={submitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Assign Contacts</label>
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading contacts...
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {contacts.map(contact => (
                                    <label
                                        key={contact.id}
                                        className="flex items-center gap-3 border rounded-md p-2 hover:bg-muted"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedContacts.includes(contact.id)}
                                            onChange={() => toggleContact(contact.id)}
                                            disabled={submitting}
                                        />
                                        <div>
                                            <div className="font-medium">{contact.first_name} {contact.last_name}</div>
                                            <div className="text-sm text-muted-foreground">{contact.email}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button onClick={handleSubmit} disabled={submitting || !name.trim()}>
                            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Create Application
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

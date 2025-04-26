"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Pencil, Save } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import { ORG_ID } from "@/lib/constants"

interface Contact {
    id: string
    first_name: string
    last_name: string
    email: string
    organisation_id: string
}

export default function ViewContactPage() {
    const { contact_id } = useParams()
    const router = useRouter()
    const [contact, setContact] = useState<Contact | null>(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const data = await api.get<Contact>(`/contacts/${contact_id}`)
                setContact(data)
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setEmail(data.email)
            } catch (err) {
                console.error("Failed to fetch contact:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchContact()
    }, [contact_id])

    const handleSave = async () => {
        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                organisation_id: ORG_ID,
            }
            await api.put(`/contacts/${contact_id}`, payload)
            setEditMode(false)
            toast.success("Contact updated successfully")
        } catch (err) {
            console.error("Failed to update contact:", err)
            alert("Failed to update contact.")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading contact details...
            </div>
        )
    }

    if (!contact) {
        return <div className="text-center text-muted-foreground">Contact not found.</div>
    }

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <Toaster />
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Contact Details</h1>
                <div className="flex gap-3">
                    <Link href="/contacts">
                        <Button variant="outline">Back</Button>
                    </Link>
                    <Button onClick={() => (editMode ? handleSave() : setEditMode(true))}>
                        {editMode ? <><Save className="w-4 h-4 mr-2" /> Save</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <Input
                            value={firstName}
                            disabled={!editMode}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <Input
                            value={lastName}
                            disabled={!editMode}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            value={email}
                            disabled={!editMode}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
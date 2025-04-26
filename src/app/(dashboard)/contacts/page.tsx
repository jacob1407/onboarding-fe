"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast, Toaster } from "sonner"
import { api } from "@/lib/api"

interface Contact {
    id: string
    first_name: string
    last_name: string
    email: string
}

const ORG_ID = "a65e7da5-8145-4d96-a787-a45cfa42c9c3"

export default function ContactsPage() {
    const hasShownToast = useRef(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await api.get<Contact[]>(`/contacts?organisation_id=${ORG_ID}`)
                setContacts(data)
            } catch (err) {
                console.error("Failed to fetch contacts:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchContacts()
    }, [])

    useEffect(() => {
        if (searchParams.get("created") === "true" && !hasShownToast.current) {
            hasShownToast.current = true
            toast.success("Contact created successfully")
            router.replace("/contacts", { scroll: false })
        }
    }, [searchParams, router])

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-8">
            <Toaster />
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">Contacts</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage contact points for each application.</p>
                </div>
                <Link href="/contacts/create">
                    <Button>Create Contact</Button>
                </Link>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Available Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading contacts...
                        </div>
                    ) : contacts.length === 0 ? (
                        <p className="text-muted-foreground">No contacts found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {contacts.map(contact => (
                                <div
                                    key={contact.id}
                                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted transition-colors"
                                >
                                    <div>
                                        <div className="font-semibold text-base">{contact.first_name} {contact.last_name}</div>
                                        <div className="text-sm text-muted-foreground">{contact.email}</div>
                                    </div>
                                    <Link href={`/contacts/${contact.id}`}>
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
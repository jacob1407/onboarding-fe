"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import Link from "next/link"

const ORG_ID = "a65e7da5-8145-4d96-a787-a45cfa42c9c3"

export default function CreateContactPage() {
    const router = useRouter()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                organisation_id: ORG_ID,
            }
            await api.post("/contacts", payload)
            router.push("/contacts?created=true")
        } catch (err) {
            console.error("Failed to create contact:", err)
            alert("Failed to create contact.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create Contact</h1>
                <Link href="/contacts">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            type="email"
                        />
                    </div>

                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Creating..." : "Create Contact"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
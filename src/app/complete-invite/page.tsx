"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface InviteInfo {
    username: string
    first_name: string
    last_name: string
    email: string
}

export default function CompleteInvitePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [form, setForm] = useState({
        username: "",
        first_name: "",
        last_name: "",
        password: "",
    })
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!token) return
        const fetchInvite = async () => {
            try {
                const inviteInfo = await api.get<InviteInfo>(`/auth/invite-info?token=${token}`)
                setForm({
                    username: inviteInfo.username,
                    first_name: inviteInfo.first_name,
                    last_name: inviteInfo.last_name,
                    password: "",
                })
                setEmail(inviteInfo.email)
            } catch {
                toast.error("Invalid or expired invite link.")
                router.push("/login")
            }
        }
        fetchInvite()
    }, [token, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        setLoading(true)

        try {
            const result = await api.post<{ message: string; user_id: string }>("/auth/complete-invite", {
                token,
                ...form,
            })

            toast.success(result.message)
            router.push("/login?invite_completed=true")
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow w-96 space-y-4"
            >
                <h1 className="text-xl font-bold">Complete Your Invite</h1>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input disabled value={email} placeholder="Email" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <Input
                        value={form.first_name}
                        onChange={(e) =>
                            setForm({ ...form, first_name: e.target.value })
                        }
                        placeholder="First name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <Input
                        value={form.last_name}
                        onChange={(e) =>
                            setForm({ ...form, last_name: e.target.value })
                        }
                        placeholder="Last name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <Input
                        value={form.username}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                        placeholder="Username"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <Input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        placeholder="Password"
                        required
                    />
                </div>

                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Create Account"}
                </Button>
            </form>
        </div>
    )
}
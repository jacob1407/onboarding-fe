"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface LoginResponse {
    access_token: string
    user: {
        id: string
        first_name: string
        last_name: string
        email: string
        user_type: "access_manager" | "admin",
        username: string
    }
}

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const searchParams = useSearchParams()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = new URLSearchParams()
        formData.append("username", email)
        formData.append("password", password)

        try {
            const res = await api.login<LoginResponse>("/auth/login", formData)

            if (!res.access_token || !res.user) {
                throw new Error("Login failed")
            }

            localStorage.setItem("access_token", res.access_token)
            localStorage.setItem("user", JSON.stringify(res.user))
            toast.success("Logged in successfully")
            router.push("/")
        } catch (err) {
            toast.error("Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const inviteCompleted = searchParams.get("invite_completed")
        if (inviteCompleted === "true") {
            setSuccessMessage("Details updated successfully. Please login with your new password.")
            router.replace("/login", { scroll: false })
        }
    }, [searchParams, router])

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-96 space-y-4">
                <h1 className="text-2xl font-bold">Login</h1>

                {successMessage && (
                    <div className="text-green-700 bg-green-100 border border-green-200 p-2 rounded text-sm">
                        {successMessage}
                    </div>
                )}

                <Input
                    type="username"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    )
}

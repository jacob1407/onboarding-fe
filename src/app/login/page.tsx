"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface LoginResponse {
    access_token: string
}

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = new URLSearchParams()
        formData.append("username", email)
        formData.append("password", password)

        try {
            const res = await api.login<LoginResponse>("/auth/login", formData)

            if (!res.access_token) {
                throw new Error("Login failed")
            }

            localStorage.setItem("access_token", res.access_token)
            toast.success("Logged in successfully")
            router.push("/")
        } catch (err) {
            toast.error("Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-96 space-y-4">
                <h1 className="text-2xl font-bold">Login</h1>

                <Input
                    type="email"
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

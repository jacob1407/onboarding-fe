"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast, Toaster } from "sonner"

interface Role {
    id: string
    name: string
    description: string
}

export default function RolesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const hasShownToast = useRef(false)

    useEffect(() => {
        const created = searchParams.get("created")
        if (created === "true" && !hasShownToast.current) {
            hasShownToast.current = true
            toast.success("Role created successfully")
            router.replace("/roles", { scroll: false })
        }
    }, [searchParams, router])

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await api.get<Role[]>(`/roles`)
                setRoles(data)
            } catch (err) {
                console.error("Failed to fetch roles:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchRoles()
    }, [])

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-8">
            <Toaster />
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">Roles</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage and view roles across your organisation.</p>
                </div>
                <Link href="/roles/create">
                    <Button>Create Role</Button>
                </Link>
            </div>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Available Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading roles...
                        </div>
                    ) : roles.length === 0 ? (
                        <p className="text-muted-foreground">No roles found for this organisation.</p>
                    ) : (
                        <div className="grid gap-4">
                            {roles.map(role => (
                                <div
                                    key={role.id}
                                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted transition-colors"
                                >
                                    <div>
                                        <div className="font-semibold text-base">{role.name}</div>
                                        <div className="text-sm text-muted-foreground">{role.description}</div>
                                    </div>
                                    <Link href={`/roles/${role.id}`}>
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
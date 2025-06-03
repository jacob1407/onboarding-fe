"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast, Toaster } from "sonner"
import { api } from "@/lib/api"

interface Application {
    id: string
    name: string
    code: string
    description: string
}

function ApplicationsPageContent() {
    const router = useRouter()
    const hasShownToast = useRef(false)
    const searchParams = useSearchParams()
    const [apps, setApps] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await api.get<Application[]>(`/applications`)
                setApps(data)
            } catch (err) {
                console.error("Failed to fetch applications:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchApps()
    }, [])


    useEffect(() => {
        const created = searchParams.get("created")
        if (created === "true" && !hasShownToast.current) {
            hasShownToast.current = true
            toast.success("Application created successfully")
            router.replace("/applications", { scroll: false })
        }
        else if (searchParams.get("deleted") === "true" && !hasShownToast.current) {
            const deleted = searchParams.get("deleted")
            if (deleted === "true" && !hasShownToast.current) {
                hasShownToast.current = true
                toast.success("Application deleted successfully")
                router.replace("/applications", { scroll: false })
            }
        }
    }, [searchParams, router])

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-8">
            <Toaster />
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">Applications</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage software access across your organisation.</p>
                </div>
                <Link href="/applications/create">
                    <Button>Create Application</Button>
                </Link>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Available Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading applications...
                        </div>
                    ) : apps.length === 0 ? (
                        <p className="text-muted-foreground">No applications found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {apps.map(app => (
                                <div
                                    key={app.id}
                                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted transition-colors"
                                >
                                    <div>
                                        <div className="font-semibold text-base">{app.name}</div>
                                        <div className="text-sm text-muted-foreground">{app.description || "No description."}</div>
                                    </div>
                                    <Link href={`/applications/${app.id}`}>
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

export default function ApplicationsPage() {
    return (
        <Suspense>
            <ApplicationsPageContent />
        </Suspense>
    )
}

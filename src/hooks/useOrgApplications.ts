import { api } from "@/lib/api"
import { useEffect, useState } from "react"

interface Application {
    id: string
    name: string
    code: string
}

export function useOrgApplications(orgId: string) {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true)
                const apps = await api.get<Application[]>(`/applications?organisation_id=${orgId}`)
                setApplications(apps)
            } catch (err) {
                setError(err as Error)
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [orgId])

    return { applications, loading, error }
}
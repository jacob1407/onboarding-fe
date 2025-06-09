"use client"

import { useEffect, useState } from "react"
import AccessManagerDashboard from "./accessManager/AccessManager"
import AdminDashboard from "./admin/AdminDashboard"
import { userLocalStorageKey } from "@/lib/constants"

export default function DashboardPage() {
    const [userType, setUserType] = useState<string | null>(null)

    useEffect(() => {
        const userJson = localStorage.getItem(userLocalStorageKey)
        if (userJson) {
            try {
                const user = JSON.parse(userJson)
                setUserType(user.type)
            } catch {
                console.error("Failed to parse user from localStorage")
            }
        }
    }, [])

    if (!userType) return <p>Loading...</p>

    switch (userType) {
        case "admin":
            return <AdminDashboard />
        case "access_manager":
            return <AccessManagerDashboard />
        default:
            return <p>Unauthorized</p>
    }
}
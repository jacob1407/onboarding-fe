"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserModel } from "../models/UserModel"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

interface OnboardingRequest {
    id: string
    status: string
    createdAt: string
    updatedAt: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [userType, setUserType] = useState<string | null>(null)
    const [pendingRequestsCount, setPendingRequestsCount] = useState<number | null>(null)

    useEffect(() => {
        const user: UserModel = JSON.parse(localStorage.getItem("user") || "{}")
        if (user?.type) {
            setUserType(user.type)
        }
    }, [])

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const data = await api.get<OnboardingRequest[]>("/onboarding/requests/contact?status=requested")
                setPendingRequestsCount(data.length)
            } catch (error) {
                console.error("Failed to fetch pending requests", error)
            }
        }

        fetchPendingRequests()
    }, [userType])

    const navItems = [
        { label: "My Requests", href: "/my-requests" },
        { label: "Employees", href: "/employees" },
        { label: "Roles", href: "/roles" },
        { label: "Applications", href: "/applications" },
        { label: "Users", href: "/users" },
    ]

    if (userType === "admin") {
        navItems.splice(0, 0, { label: "Dashboard", href: "/" })
    }

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-100 border-r p-4 space-y-2">
                <h2 className="text-lg font-bold mb-4">Access Manager</h2>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "block px-3 py-2 rounded hover:bg-gray-200",
                            pathname === item.href && "bg-gray-200 font-medium"
                        )}
                    >
                        {item.label}
                        {item.label === "My Requests" &&
                            pendingRequestsCount !== null && pendingRequestsCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                    {pendingRequestsCount}
                                </span>
                            )}
                    </Link>
                ))}
            </aside>

            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    )
}

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserModel } from "../models/UserModel"
import { useEffect, useState, useRef } from "react"
import { api } from "@/lib/api"
import { accessTokenLocalStorageKey, userLocalStorageKey } from "@/lib/constants"
import { UserType } from "../enums/UserType"

interface OnboardingRequest {
    id: string
    status: string
    createdAt: string
    updatedAt: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [userType, setUserType] = useState<string | null>(null)
    const [user, setUser] = useState<UserModel | null>(null)
    const [pendingRequestsCount, setPendingRequestsCount] = useState<number | null>(null)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        const storedUser: UserModel = JSON.parse(localStorage.getItem(userLocalStorageKey) || "{}")
        if (storedUser?.type) {
            setUserType(storedUser.type)
            setUser(storedUser)
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

        if (userType) fetchPendingRequests()
    }, [userType])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem(accessTokenLocalStorageKey)
        localStorage.removeItem(userLocalStorageKey)
        router.push("/login")
    }

    const getInitials = (firstName = "", lastName = "") => {
        return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase()
    }

    const navItems = [
        { label: "Employees", href: "/employees" },
        { label: "Roles", href: "/roles" },
        { label: "Applications", href: "/applications" },
        { label: "Users", href: "/users" },
    ]

    if (userType === "access_manager") {
        navItems.splice(0, 0, { label: "My Requests", href: "/" })
    }

    if (userType === "admin") {
        navItems.splice(0, 0, { label: "Dashboard", href: "/" })
        navItems.splice(1, 0, { label: "My Requests", href: "/my-requests" })
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

            <main className="flex-1 p-6 overflow-auto relative">
                <div className="absolute top-4 right-6" ref={dropdownRef}>
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="bg-gray-300 text-gray-800 rounded-full h-10 w-10 flex items-center justify-center font-semibold hover:bg-gray-400"
                            >
                                {getInitials(user.first_name, user.last_name)}
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-10 p-4 text-sm">
                                    <div className="mb-2">
                                        <div className="font-semibold">{user.first_name} {user.last_name}</div>
                                        <div className="text-gray-600">{user.email}</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {children}
            </main>
        </div>
    )
}

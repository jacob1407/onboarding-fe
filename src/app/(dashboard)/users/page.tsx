"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { toast, Toaster } from "sonner"
import { api } from "@/lib/api"

interface User {
    id: string
    first_name: string
    last_name: string
    email: string
    username: string
    type: UserType
    status: string
}

enum UserType {
    admin = "admin",
    access_manager = "access_manager",
}

function userTypeToString(type: UserType): string {
    switch (type) {
        case UserType.admin:
            return "Admin"
        case UserType.access_manager:
            return "Access Manager"
        default:
            return "Unknown"
    }
}

function UserStatusBadge({ status }: { status: string }) {
    const getStyle = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800"
            case "inactive":
                return "bg-gray-100 text-gray-700"
            case "invited":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStyle(status)}`}>
            {status}
        </span>
    )
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.get<User[]>(`/users?user_types=admin&user_types=access_manager`)
                setUsers(data)
            } catch (err) {
                console.error("Failed to fetch users:", err)
                toast.error("Failed to load users")
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-8">
            <Toaster />
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage users in your organisation.
                    </p>
                </div>
                <Link href="/users/create">
                    <Button>Create User</Button>
                </Link>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Current Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading users...
                        </div>
                    ) : users.length === 0 ? (
                        <p className="text-muted-foreground">No users found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={undefined} />
                                            <AvatarFallback>
                                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-base">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                            <div className="text-sm mt-1">
                                                <strong>Username:</strong> {user.username}
                                            </div>
                                            <div className="text-sm mt-1">
                                                <strong>Role:</strong> {userTypeToString(user.type)}
                                            </div>
                                            <div className="text-sm mt-1">
                                                <strong>Status:</strong> <UserStatusBadge status={user.status} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/users/${user.id}`}>
                                            <Button variant="outline" size="sm">View</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

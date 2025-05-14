"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: "Roles", href: "/roles" },
    { label: "Applications", href: "/applications" },
    { label: "Contacts", href: "/contacts" },
    { label: "Settings", href: "/settings" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

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
                    </Link>
                ))}
            </aside>

            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    )
}

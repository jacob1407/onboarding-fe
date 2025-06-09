"use client"

import React from "react"

interface ErrorBoundaryProps {
    children: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can log error info here if needed
        // e.g., log to an error reporting service
        // console.error(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-8">
                    <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                    <p className="mb-4 text-muted-foreground">{this.state.error?.message || "An unexpected error occurred."}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>Reload</button>
                </div>
            )
        }
        return this.props.children
    }
}

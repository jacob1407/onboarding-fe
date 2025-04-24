const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

async function request<T>(url: string, options: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    })

    console.log("response: ", res)
    if (!res.ok) {
        const error = await res.text()
        throw new Error(`API Error: ${res.status} ${res.statusText} - ${error}`)
    }

    return res.json()
}

export const api = {
    get: <T>(url: string) => request<T>(url, { method: "GET" }),
    post: <T>(url: string, body: any) =>
        request<T>(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),
    put: <T>(url: string, body: any) =>
        request<T>(url, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
}

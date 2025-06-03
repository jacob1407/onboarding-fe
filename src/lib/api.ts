const BASE_URL = process.env.BASE_URL || "http://localhost:8080"

async function request<T>(url: string, options: RequestInit): Promise<T> {
    console.log("process.env.BASE_URL: ", process.env.BASE_URL)
    const token = localStorage.getItem("access_token")
    const res = await fetch(`${BASE_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            "Authorization": `Bearer ${token}`,
        },
        ...options,
    })

    console.log("response: ", res)
    if (!res.ok) {
        const error = await res.text()
        if (res.status === 401 && error.includes("token expired") || error.includes("Signature has expired")) {
            localStorage.removeItem("token")
            window.location.href = "/login"
            return {} as T
        }
        throw new Error(`API Error: ${res.status} ${res.statusText} - ${error}`)
    }

    if (options.method === "DELETE") {
        return {} as T
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
    login: <T>(url: string, body: any) =>
        request<T>(url, {
            method: "POST",
            body: body.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }),
    put: <T>(url: string, body: any) =>
        request<T>(url, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
}

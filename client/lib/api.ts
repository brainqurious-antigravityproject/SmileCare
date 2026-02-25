const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText || "Something went wrong");
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        }),
    put: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};

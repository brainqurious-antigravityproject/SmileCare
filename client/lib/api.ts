import { getApiBaseUrl } from "./api-base";

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = 3000
): Promise<T> {
    const url = `${getApiBaseUrl()}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            credentials: "include",   // Always send cookies (accessToken)
            ...options,
            signal: options.signal || controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const err = new Error(
                errorData.message || response.statusText || "Something went wrong"
            ) as any;
            err.status = response.status;
            throw err;
        }

        return response.json();
    } catch (err: any) {
        clearTimeout(timeoutId);
        throw err;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit, timeoutMs?: number) =>
        apiFetch<T>(endpoint, { ...options, method: "GET" }, timeoutMs),
    post: <T>(endpoint: string, body: any, options?: RequestInit, timeoutMs?: number) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        }, timeoutMs),
    put: <T>(endpoint: string, body: any, options?: RequestInit, timeoutMs?: number) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }, timeoutMs),
    delete: <T>(endpoint: string, options?: RequestInit, timeoutMs?: number) =>
        apiFetch<T>(endpoint, { ...options, method: "DELETE" }, timeoutMs),
};




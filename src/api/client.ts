import type {AuthTokens} from "../types";
import {BASE_URL} from "../config";

// ─── Token storage ────────────────────────────────────────────────────────────

export const tokenStore = {
    getAccess: () => localStorage.getItem("accessToken"),
    getRefresh: () => localStorage.getItem("refreshToken"),

    set: (tokens: AuthTokens) => {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
    },
    clear: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },
};

// ─── Token refresh ────────────────────────────────────────────────────────────

type FetchOptions = RequestInit & {
    skipAuth?: boolean;
    params?: Record<string, string | number | boolean>;
};

let refreshPromise: Promise<AuthTokens> | null = null;

/**
 * Refreshes the access token using the stored refresh token.
 * Uses a shared promise so concurrent 401s only trigger one refresh request.
 * Intentionally does NOT import authApi to avoid a circular dependency.
 */
async function refreshTokens(): Promise<AuthTokens> {
    if (refreshPromise) return refreshPromise;

    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) throw new Error("No refresh token available");

    refreshPromise = fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
        },
    })
        .then(async (r) => {
            if (!r.ok) throw await r.json().catch(() => ({message: r.statusText}));
            return r.json() as Promise<AuthTokens>;
        })
        .then((tokens) => {
            tokenStore.set(tokens);
            return tokens;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

export async function apiRequest<T>(
    path: string,
    options: FetchOptions = {}
): Promise<T> {
    const {skipAuth = false, params, ...fetchOptions} = options;

    // Build URL with optional query parameters
    let url = `${BASE_URL}${path}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) url += `?${queryString}`;
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (!skipAuth) {
        const token = tokenStore.getAccess();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {...fetchOptions, headers});

    // Attempt a silent token refresh on 401
    if (res.status === 401 && !skipAuth) {
        try {
            const tokens = await refreshTokens();
            headers["Authorization"] = `Bearer ${tokens.accessToken}`;
            const retried = await fetch(url, {...fetchOptions, headers});
            if (!retried.ok) {
                throw await retried.json().catch(() => ({message: retried.statusText}));
            }
            if (retried.status === 204) return undefined as T;
            return (await retried.json()) as T;
        } catch {
            tokenStore.clear();
            globalThis.location.href = "/login";
            throw new Error("Session expired");
        }
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({message: res.statusText}));
        throw {...error, status: res.status};
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}
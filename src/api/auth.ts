import {apiRequest, tokenStore} from "./client";
import type {AuthTokens, LoginRequest, RegisterRequest, User} from "../types";

export const authApi = {
    register: (data: RegisterRequest) =>
        apiRequest<void>("/api/v1/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
            skipAuth: true,
        }),

    verifyEmail: (token: string) =>
        apiRequest<void>(`/api/v1/auth/verify-email?token=${token}`, {
            skipAuth: true,
        }),

    resendVerification: (email: string) =>
        apiRequest<void>(`/api/v1/auth/resend-verification?email=${encodeURIComponent(email)}`, {
            method: "POST",
            skipAuth: true,
        }),

    login: (data: LoginRequest) =>
        apiRequest<AuthTokens>("/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
            skipAuth: true,
        }),

    refresh: (refreshToken: string) =>
        apiRequest<AuthTokens>("/api/v1/auth/refresh", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${refreshToken}`
            },
            skipAuth: true,
        }),

    logout: () =>
        apiRequest<void>("/api/v1/auth/logout", {
            method: "POST",
            body: JSON.stringify({refreshToken: tokenStore.getRefresh()})
        }),

    logoutAll: () =>
        apiRequest<void>("/api/v1/auth/logout-all-devices", {method: "POST"}),

    forgotPassword: (email: string) =>
        apiRequest<void>("/api/v1/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({email}),
            skipAuth: true,
        }),

    resetPassword: (token: string, newPassword: string) =>
        apiRequest<void>("/api/v1/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({token, newPassword}),
            skipAuth: true,
        }),

    getMe: () => apiRequest<User>("/api/v1/users/me"),

    changePassword: (currentPassword: string, newPassword: string) =>
        apiRequest<void>("/api/v1/users/me/change-password", {
            method: "PUT",
            body: JSON.stringify({currentPassword, newPassword}),
        }),
};
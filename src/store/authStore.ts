import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { tokenStore } from "../api/client";
import { authApi } from "../api/auth";

interface AuthState {
    user:            User | null;
    isAuthenticated: boolean;
    isLoading:       boolean;
    setUser:    (user: User | null) => void;
    logout:     () => Promise<void>;
    loadUser:   () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            //----------------------------------------------
            user:            null,
            isAuthenticated: false,
            isLoading:       false,
            //----------------------------------------------

            //---------------------------------------------
            // user: import.meta.env.DEV ? {
            //     id: 1,
            //     email: "dev@sentinel.local",
            //     firstName: "John",
            //     lastName: "Doe",
            //     role: "USER" as const,
            //     locked: false,
            //     enabled: true,
            //     emailVerified: true,
            // } : null,
            // isAuthenticated: import.meta.env.DEV ? true : !!tokenStore.getAccess(),
            // isLoading: false,
            //---------------------------------------------

            setUser: (user) =>
                set({ user, isAuthenticated: !!user }),

            logout: async () => {
                try {
                    await authApi.logout();
                } catch {
                    // Ignore server errors — always clear local state.
                } finally {
                    tokenStore.clear();
                    set({ user: null, isAuthenticated: false });
                }
            },

            loadUser: async () => {
                if (!tokenStore.getAccess()) return;
                set({ isLoading: true });
                try {
                    const user = await authApi.getMe();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch {
                    tokenStore.clear();
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },
        }),
        {
            name: "sentinel-auth",
            // Only persist the user object everything else is derived or transient.
            partialize: (state) => ({ user: state.user }),
            // After rehydration, sync isAuthenticated with the restored user AND token.
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isAuthenticated = !!state.user && !!tokenStore.getAccess();
                }
            },
        }
    )
);
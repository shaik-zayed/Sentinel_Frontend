import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.ts";
import { Spinner } from "../ui";

export function ProtectedRoute() {
    // Skip auth check in dev mode
    // if (import.meta.env.DEV) return <Outlet />;

    const { isAuthenticated, loadUser } = useAuthStore();
    const user = useAuthStore((s) => s.user);

    // If we already have a persisted user, skip the loading spinner entirely.
    const [checking, setChecking] = useState(!user);

    useEffect(() => {
        // User is already in store — no need to hit the API.
        if (user) return;

        // No user yet: try to load from the server (validates the stored token).
        loadUser().finally(() => setChecking(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (checking) return (
        <div className="flex items-center justify-center h-screen bg-zinc-950">
            <Spinner size="lg" />
        </div>
    );

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
}
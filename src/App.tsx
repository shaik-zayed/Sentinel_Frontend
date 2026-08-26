import React, {lazy, Suspense} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {ErrorBoundary} from "./components/ErrorBoundary";
import {AuthLayout} from "./components/layout/AuthLayout";
import {AppLayout} from "./components/layout/AppLayout";
import {ProtectedRoute} from "./components/layout/ProtectedRoute";
import {useAuthStore} from "./store/authStore";
import {Spinner} from "./components/ui";

// ─── Lazy pages ──────────────────────────────────────────────────────────────

const LandingPage = lazy(() =>
    import("./pages/LandingPage").then((m) => ({default: m.LandingPage}))
);
const LoginPage = lazy(() =>
    import("./pages/auth/LoginPage").then((m) => ({default: m.LoginPage}))
);
const RegisterPage = lazy(() =>
    import("./pages/auth/RegisterPage").then((m) => ({default: m.RegisterPage}))
);
const VerifyEmailPage = lazy(() =>
    import("./pages/auth/VerifyEmailPage").then((m) => ({default: m.VerifyEmailPage}))
);
const ForgotPasswordPage = lazy(() =>
    import("./pages/auth/ForgotPasswordPage").then((m) => ({default: m.ForgotPasswordPage}))
);
const ResetPasswordPage = lazy(() =>
    import("./pages/auth/ResetPasswordPage").then((m) => ({default: m.ResetPasswordPage}))
);
const DashboardPage = lazy(() =>
    import("./pages/DashboardPage").then((m) => ({default: m.DashboardPage}))
);
const ScansPage = lazy(() =>
    import("./pages/scans/ScansPage").then((m) => ({default: m.ScansPage}))
);
const NewScanPage = lazy(() =>
    import("./pages/scans/NewScanPage").then((m) => ({default: m.NewScanPage}))
);
const ScanDetailPage = lazy(() =>
    import("./pages/scans/ScanDetailPage").then((m) => ({default: m.ScanDetailPage}))
);
const ReportsPage = lazy(() =>
    import("./pages/scans/ReportsPage").then((m) => ({default: m.ReportsPage}))
);
const ProfilePage = lazy(() =>
    import("./pages/ProfilePage").then((m) => ({default: m.ProfilePage}))
);
const ChangePasswordPage = lazy(() =>
    import("./pages/auth/ChangePasswordPage").then((m) => ({default: m.ChangePasswordPage}))
);

// ─── Query Client ────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
        },
    },
});

// ─── Catch‑all redirect ──────────────────────────────────────────────────────

function CatchAllRedirect() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace/>;
}

// ─── Page loader wrapper (handles chunk loading errors) ─────────────────────
function PageLoader({children}: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center p-8"><Spinner size="lg"/></div>}>
            {children}
        </Suspense>
    );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    {/* Global Suspense ONLY for auth pages (no persistent UI) */}
                    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-zinc-950"><Spinner
                        size="lg"/></div>}>
                        <Routes>
                            {/* Landing — standalone */}
                            <Route path="/" element={<PageLoader><LandingPage/></PageLoader>}/>

                            {/* Auth routes — no persistent UI, global fallback is fine */}
                            <Route element={<AuthLayout/>}>
                                <Route path="/login" element={<LoginPage/>}/>
                                <Route path="/register" element={<RegisterPage/>}/>
                                <Route path="/verify-email" element={<VerifyEmailPage/>}/>
                                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                                <Route path="/reset-password" element={<ResetPasswordPage/>}/>
                            </Route>

                            {/* Protected routes — individual Suspense keeps sidebar visible */}
                            <Route element={<ProtectedRoute/>}>
                                <Route element={<AppLayout/>}>
                                    <Route path="/dashboard" element={<PageLoader><DashboardPage/></PageLoader>}/>
                                    <Route path="/scans" element={<PageLoader><ScansPage/></PageLoader>}/>
                                    <Route path="/scans/new" element={<PageLoader><NewScanPage/></PageLoader>}/>
                                    <Route path="/scans/:scanId" element={<PageLoader><ScanDetailPage/></PageLoader>}/>
                                    <Route path="/reports" element={<PageLoader><ReportsPage/></PageLoader>}/>
                                    <Route path="/me" element={<PageLoader><ProfilePage/></PageLoader>}/>
                                    <Route path="/me/change-password" element={<PageLoader><ChangePasswordPage/></PageLoader>}/>
                                </Route>
                            </Route>

                            <Route path="*" element={<CatchAllRedirect/>}/>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
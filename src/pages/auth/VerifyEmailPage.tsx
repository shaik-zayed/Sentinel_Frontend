import {useEffect, useRef, useState} from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Alert, Button, Card, Spinner } from "../../components/ui";

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const token = searchParams.get("token");
    const email = (location.state as any)?.email ?? "";
    const fresh = (location.state as any)?.fresh ?? false;

    const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(token ? "verifying" : "idle");
    const [error, setError] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSent, setResendSent] = useState(false);
    const hasVerified = useRef(false);

    useEffect(() => {
        if (!token || hasVerified.current) return;
        hasVerified.current = true;
        authApi
            .verifyEmail(token)
            .then(() => setStatus("success"))
            .catch((err) => {
                setError(err?.message ?? "Verification failed.");
                setStatus("error");
            });
    }, [token]);

    const handleResend = async () => {
        if (!email) return;
        setResendLoading(true);
        try {
            await authApi.resendVerification(email);
            setResendSent(true);
        } finally {
            setResendLoading(false);
        }
    };

    if (status === "verifying") {
        return (
            <Card className="p-8 flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-zinc-400 text-sm">Verifying your email…</p>
            </Card>
        );
    }

    if (status === "success") {
        return (
            <Card className="p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-zinc-100">Email verified</h2>
                    <p className="text-sm text-zinc-500 mt-1">Your account is ready to use.</p>
                </div>
                <Link to="/login">
                    <Button size="lg">Sign in</Button>
                </Link>
            </Card>
        );
    }

    return (
        <Card className="p-8">
            <div className="mb-6 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-900/30 border border-indigo-800/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-zinc-100">Check your email</h2>
                {fresh && email ? (
                    <p className="text-sm text-zinc-500 mt-1">
                        We sent a verification link to <span className="text-zinc-300">{email}</span>.
                    </p>
                ) : (
                    <p className="text-sm text-zinc-500 mt-1">Click the link in your email to verify your account.</p>
                )}
            </div>

            {status === "error" && <Alert variant="error" message={error} />}
            {resendSent && <Alert variant="success" message="Verification email sent." />}

            {email && (
                <Button
                    variant="secondary"
                    className="w-full justify-center mt-4"
                    loading={resendLoading}
                    onClick={handleResend}
                    disabled={resendSent}
                >
                    Resend verification email
                </Button>
            )}

            <p className="text-center text-sm text-zinc-600 mt-4">
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
                    Back to sign in
                </Link>
            </p>
        </Card>
    );
}
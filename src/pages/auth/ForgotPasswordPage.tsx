import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Button, Input, Alert, Card } from "../../components/ui";

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err?.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <Card className="p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-copper-900/30 border border-copper-800/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-copper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-zinc-100">Check your email</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        If <span className="text-zinc-300">{email}</span> is registered, you'll receive a reset link shortly.
                    </p>
                </div>
                <Link to="/login" className="text-sm text-copper-400 hover:text-copper-300">
                    Back to sign in
                </Link>
            </Card>
        );
    }

    return (
        <Card className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-zinc-100">Reset password</h1>
                <p className="text-sm text-zinc-500 mt-1">We'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <Alert variant="error" message={error} />}
                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <Button type="submit" loading={loading} className="w-full justify-center mt-1" size="lg">
                    Send reset link
                </Button>
            </form>

            <p className="text-center text-sm text-zinc-600 mt-6">
                <Link to="/login" className="text-copper-400 hover:text-copper-300">
                    Back to sign in
                </Link>
            </p>
        </Card>
    );
}
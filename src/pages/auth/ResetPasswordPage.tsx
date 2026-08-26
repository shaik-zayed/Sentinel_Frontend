import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Button, Input, Alert, Card } from "../../components/ui";

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await authApi.resetPassword(token, password);
            navigate("/login", { state: { message: "Password reset. You can now sign in." } });
        } catch (err: any) {
            setError(err?.message ?? "Reset failed. The link may have expired.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <Card className="p-8 text-center">
                <p className="text-zinc-400 text-sm">Invalid or missing reset token.</p>
                <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300 text-sm mt-3 inline-block">
                    Request a new link
                </Link>
            </Card>
        );
    }

    return (
        <Card className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-zinc-100">New password</h1>
                <p className="text-sm text-zinc-500 mt-1">Choose a strong password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <Alert variant="error" message={error} />}
                <Input
                    label="New password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                />
                <Input
                    label="Confirm password"
                    type="password"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                />
                <Button type="submit" loading={loading} className="w-full justify-center mt-1" size="lg">
                    Set new password
                </Button>
            </form>
        </Card>
    );
}
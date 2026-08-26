import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {authApi} from "../../api/auth.ts";
import {Button, Input, Alert, Card} from "../../components/ui";

// ── Validation ────────────────────────────────────────────────────────────────

function validateNewPassword(pwd: string): string | null {
    if (pwd.length < 8) return "Password must be at least 8 characters.";
    if (pwd.length >= 25) return "Password must be less than 25 characters.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number.";
    if (!/[^A-Za-z0-9]/.test(pwd)) return "Password must contain at least one symbol.";
    return null;
}

// ── Page component ────────────────────────────────────────────────────────────

export function ChangePasswordPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const sameAsCurrent =
        form.newPassword.length > 0 &&
        form.currentPassword.length > 0 &&
        form.currentPassword === form.newPassword;

    const passwordsMatch =
        form.confirmPassword.length > 0 &&
        form.newPassword === form.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.currentPassword === form.newPassword) {
            setError("New password must be different from the current one.");
            return;
        }

        const pwdError = validateNewPassword(form.newPassword);
        if (pwdError) {
            setError(pwdError);
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await authApi.changePassword(form.currentPassword, form.newPassword);
            setSuccess(true);
            setTimeout(() => navigate("/me"), 2000);
        } catch (err: any) {
            setError(err?.message ?? "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    // ── Success state ─────────────────────────────────────────────────────────

    if (success) {
        return (
            <div className="p-8 max-w-md mx-auto">
                <Card className="p-10 text-center">
                    <div
                        className="w-14 h-14 rounded-full bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center mx-auto mb-5">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-100 mb-1.5">Password updated</h2>
                    <p className="text-sm text-zinc-500">Redirecting to your profile…</p>
                </Card>
            </div>
        );
    }

    // ── Form ──────────────────────────────────────────────────────────────────

    return (
        <div className="p-8 max-w-md mx-auto">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Change password</h1>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <Alert variant="error" message={error}/>}

                    {/* Current password */}
                    <Input
                        label="Current password"
                        type="password"
                        placeholder="••••••••"
                        value={form.currentPassword}
                        onChange={(e) => setForm({...form, currentPassword: e.target.value})}
                        required
                        autoComplete="current-password"
                    />

                    {/* New password */}
                    <div>
                        <Input
                            label="New password"
                            type="password"
                            placeholder="••••••••"
                            value={form.newPassword}
                            onChange={(e) => setForm({...form, newPassword: e.target.value})}
                            required
                            autoComplete="new-password"
                        />
                        {sameAsCurrent && (
                            <p className="text-[11px] mt-1.5 font-medium leading-none text-red-400">
                                Must be different from your current password
                            </p>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div>
                        <Input
                            label="Confirm new password"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                            required
                            disabled={sameAsCurrent}
                            autoComplete="new-password"
                        />
                        {form.confirmPassword && (
                            <p className={`text-[11px] mt-1.5 font-medium leading-none transition-colors ${
                                passwordsMatch ? "text-emerald-400" : "text-zinc-600"
                            }`}>
                                {passwordsMatch ? "✓ Passwords match" : "Passwords don't match yet"}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={() => navigate("/me")}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading}>
                            Save password
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
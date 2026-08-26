import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { tokenStore } from "../../api/client";
import { useAuthStore } from "../../store/authStore";
import { Button, Input, Alert, Card } from "../../components/ui";

export function LoginPage() {
    const navigate = useNavigate();
    const { loadUser } = useAuthStore();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const tokens = await authApi.login(form);
            tokenStore.set(tokens);
            await loadUser();
            navigate("/dashboard");
        } catch (err: any) {
            setError(err?.message ?? "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-zinc-100">Sign in</h1>
                <p className="text-sm text-zinc-500 mt-1">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <Alert variant="error" message={error} />}

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                />

                <div>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        autoComplete="current-password"
                    />
                    <Link
                        to="/forgot-password"
                        className="text-xs text-copper-400 hover:text-copper-300 mt-1.5 inline-block"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" loading={loading} className="w-full justify-center mt-1" size="lg">
                    Sign in
                </Button>
            </form>

            <p className="text-center text-sm text-zinc-600 mt-6">
                No account?{" "}
                <Link to="/register" className="text-copper-400 hover:text-copper-300">
                    Create one
                </Link>
            </p>
        </Card>
    );
}
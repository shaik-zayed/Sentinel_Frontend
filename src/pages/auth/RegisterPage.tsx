import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Button, Input, Alert, Card } from "../../components/ui";

export function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: "",lastName:"", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authApi.register(form);
            navigate("/verify-email", { state: { email: form.email, fresh: true } });
        } catch (err: any) {
            setError(err?.message ?? "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [field]: e.target.value }));

    return (
        <Card className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-zinc-100">Create account</h1>
                <p className="text-sm text-zinc-500 mt-1">Get started with Sentinel</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <Alert variant="error" message={error} />}

                <Input
                    label="First Name"
                    placeholder="john"
                    value={form.firstName}
                    onChange={set("firstName")}
                    required
                    autoComplete="firstName"
                />
                <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={set("lastName")}
                    required
                    autoComplete="lastName"
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                    autoComplete="email"
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={set("password")}
                    required
                    minLength={8}
                    autoComplete="new-password"
                />

                <Button type="submit" loading={loading} className="w-full justify-center mt-1" size="lg">
                    Create account
                </Button>
            </form>

            <p className="text-center text-sm text-zinc-600 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-copper-400 hover:text-copper-300">
                    Sign in
                </Link>
            </p>
        </Card>
    );
}
import { Link } from "react-router-dom";
import { Button, Card } from "../components/ui";
import { useAuthStore } from "../store/authStore.ts";

export function ProfilePage() {
    const user = useAuthStore((s) => s.user);

    if (!user) return null;

    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Profile</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Your account information</p>
            </div>

            <Card className="overflow-hidden">
                {/* ── Avatar header ── */}
                <div
                    className="relative px-6 pt-8 pb-6 flex items-center gap-5 border-b border-zinc-800/60"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(109,40,217,0.14) 0%, rgba(124,58,237,0.06) 50%, transparent 100%)",
                    }}
                >
                    {/* Ambient glow behind avatar */}
                    <div
                        className="absolute left-4 top-4 w-24 h-24 rounded-full pointer-events-none"
                        style={{
                            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
                            filter: "blur(16px)",
                        }}
                    />

                    {/* Initials avatar — faceted crystal look: hard-edged conic facets
                        (no blur, unlike the metal buttons) plus one sharp specular glint */}
                    <div
                        className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0 select-none overflow-hidden"
                        style={{
                            background: `conic-gradient(
                                from 200deg at 35% 20%,
                                #f5f3ff 0deg, #f5f3ff 14.5deg, #7c3aed 15.5deg,
                                #7c3aed 54.5deg, #4c1d95 55.5deg,
                                #4c1d95 94.5deg, #a78bfa 95.5deg,
                                #a78bfa 134.5deg, #5b21b6 135.5deg,
                                #5b21b6 174.5deg, #ddd6fe 175.5deg,
                                #ddd6fe 214.5deg, #4c1d95 215.5deg,
                                #4c1d95 254.5deg, #8b5cf6 255.5deg,
                                #8b5cf6 294.5deg, #2e1065 295.5deg,
                                #2e1065 334.5deg, #f5f3ff 335.5deg,
                                #f5f3ff 360deg
                            )`,
                            boxShadow:
                                "0 4px 20px rgba(124,58,237,0.4), " +
                                "inset 0 1px 1px rgba(255,255,255,0.5), " +
                                "inset 0 -3px 6px rgba(46,16,101,0.55)",
                        }}
                    >
                        {/* specular glint — small and sharp, not a soft blob */}
                        <span
                            aria-hidden="true"
                            className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
                            style={{
                                top: "14%",
                                left: "18%",
                                background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 75%)",
                            }}
                        />
                        <span
                            className="relative z-10"
                            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.65), 0 0 8px rgba(0,0,0,0.45)" }}
                        >
                            {initials}
                        </span>
                    </div>

                    {/* Full name — grows to fill available space */}
                    <p className="flex-1 text-lg font-semibold text-zinc-100 leading-snug truncate">
                        {user.firstName} {user.lastName}
                    </p>

                    {/* Badges pinned to the right */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                user.enabled
                                    ? "bg-emerald-950/60 text-emerald-500 border border-emerald-800/40"
                                    : "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                            }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    user.enabled ? "bg-emerald-500" : "bg-amber-400"
                                }`}
                            />
                            {user.enabled ? "Verified" : "Not verified"}
                        </span>
                        {user.locked && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-950/60 text-red-400 border border-red-800/40">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                Locked
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Detail rows ── */}
                <div className="divide-y divide-zinc-800/40">
                    <div className="px-6 py-4 flex items-center gap-8">
                        <span className="w-20 shrink-0 text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">
                            Name
                        </span>
                        <span className="text-sm text-zinc-200">
                            {user.firstName} {user.lastName}
                        </span>
                    </div>
                    <div className="px-6 py-4 flex items-center gap-8">
                        <span className="w-20 shrink-0 text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">
                            Email
                        </span>
                        <span className="text-sm text-zinc-200">{user.email}</span>
                    </div>
                    <div className="px-6 py-4 flex items-center gap-8">
                        <span className="w-20 flex-shrink-0 text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">
                            Role
                        </span>
                        <span className="text-sm text-zinc-200 capitalize">{user.role}</span>
                    </div>
                </div>

                {/* ── Footer action ── */}
                <div className="px-6 py-4 border-t border-zinc-800/60 bg-zinc-900/20">
                    <Link to="/me/change-password">
                        <Button variant="secondary" size="md">
                            Change password
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
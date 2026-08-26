import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { scanApi } from "../api/scans.ts";
import { useAuthStore } from "../store/authStore";
import { Card, StatusBadge, Spinner, Button } from "../components/ui";
import { formatDate } from "../utils/format";
import type { Scan, ScanStatus } from "../types";

function StatCard({label, value, color}: { label: string; value: number; color: string }) {
    return (
        <Card className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-semibold mt-1 ${color}`}>{value}</p>
        </Card>
    );
}

export function DashboardPage() {
    const user = useAuthStore((s) => s.user);

    const { data: scans = [], isLoading } = useQuery({
        queryKey: ["scans", "dashboard"],
        queryFn: () => scanApi.list(100, 0),
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
    });

    const counts = scans.reduce(
        (acc, s) => {
            acc[s.status] = (acc[s.status] ?? 0) + 1;
            return acc;
        },
        {} as Record<ScanStatus, number>
    );

    const recent = [...scans]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5); //Displays only 5 scans.

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-100">
                        Good {getGreeting()}, {user?.firstName ?? "User"}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Here's an overview of your scans.</p>
                </div>
                <Link to="/scans/new">
                    <Button
                        size="md"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                            </svg>
                        }
                    >
                        New Scan
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total" value={scans.length} color="text-zinc-100"/>
                <StatCard label="Running" value={counts.STARTED ?? 0} color="text-blue-400"/>
                <StatCard label="Finished" value={counts.FINISHED ?? 0} color="text-emerald-500"/>
                <StatCard label="Failed" value={counts.FAILED ?? 0} color="text-red-400"/>
            </div>

            {/* Recent scans */}
            <Card>
                <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-zinc-300">Recent Scans</h2>
                    <Link to="/scans" className="text-xs text-zinc-300 hover:text-zinc-200">
                        View all →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner/>
                    </div>
                ) : recent.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-zinc-600 text-sm">No scans yet.</p>
                        <Link
                            to="/scans/new"
                            className="text-copper-400 hover:text-copper-300 text-sm mt-1 inline-block"
                        >
                            Run your first scan →
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-zinc-800/60">
                        {recent.map((scan) => <ScanRow key={scan.scanId} scan={scan}/>)}
                    </ul>
                )}
            </Card>
        </div>
    );
}

function ScanRow({ scan }: { scan: Scan }) {
    return (
        <li>
            <Link
                to={`/scans/${scan.scanId}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{scan.target}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{formatDate(scan.createdAt, true)}</p>
                </div>
                <StatusBadge status={scan.status}/>
            </Link>
        </li>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 17) return "afternoon";
    return "evening";
}
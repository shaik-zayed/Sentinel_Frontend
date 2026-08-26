import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { scanApi } from "../../api/scans";
import { Card, EmptyState, Spinner, Button } from "../../components/ui";
import { ReportDownload } from "../../components/ReportDownload";
import { formatDate } from "../../utils/format";
import type { Scan } from "../../types";

export function ReportsPage() {
    const { data: scans = [], isLoading } = useQuery({
        queryKey: ["scans", "all"],
        queryFn:  () => scanApi.list(100, 0),
    });

    const finished = scans.filter((s) => s.status === "FINISHED");

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-zinc-100">Reports</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Download reports for completed scans.</p>
            </div>

            <Card>
                <div className="px-5 py-3 border-b border-zinc-800 text-xs text-zinc-600 uppercase tracking-wider">
                    Completed Scans
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Spinner />
                    </div>
                ) : finished.length === 0 ? (
                    <EmptyState
                        icon="📄"
                        title="No completed scans"
                        description="Reports are available once a scan finishes."
                        action={
                            <Link to="/scans/new">
                                <Button size="sm">Run a scan</Button>
                            </Link>
                        }
                    />
                ) : (
                    <ul className="divide-y divide-zinc-800/60">
                        {finished.map((scan) => <ReportRow key={scan.scanId} scan={scan} />)}
                    </ul>
                )}
            </Card>
        </div>
    );
}

function ReportRow({ scan }: { scan: Scan }) {
    return (
        <li className="px-5 py-4">
            <div className="flex items-center justify-between gap-6 flex-wrap">
                <div className="min-w-0">
                    <Link
                        to={`/scans/${scan.scanId}`}
                        className="text-sm font-medium text-zinc-200 hover:text-copper-400 transition-colors font-mono"
                    >
                        {scan.target}
                    </Link>
                    <p className="text-xs text-zinc-600 mt-0.5">
                        {scan.scanMode ? `${scan.scanMode} · ` : ""}
                        {formatDate(scan.createdAt)}
                    </p>
                </div>

                <ReportDownload scanId={scan.scanId} />
            </div>
        </li>
    );
}
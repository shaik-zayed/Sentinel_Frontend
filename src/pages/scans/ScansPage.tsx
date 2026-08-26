import {useState} from "react";
import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {scanApi} from "../../api/scans";
import {Button, Card, EmptyState, Spinner, StatusBadge} from "../../components/ui";
import {formatDate} from "../../utils/format";
import type {Scan} from "../../types";

const PAGE_SIZE = 20;

export function ScansPage() {
    const [page, setPage] = useState(0);

    const {data: scans = [], isLoading, isFetching} = useQuery({
        queryKey: ["scans", page],
        queryFn: () => scanApi.list(PAGE_SIZE, page),
        refetchInterval: 10_000,
    });

    const hasNextPage = scans.length === PAGE_SIZE;
    const hasPrevPage = page > 0;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-100">Scans</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        {isLoading
                            ? "Loading..."
                            : `${scans.length} scan${scans.length !== 1 ? "s" : ""} on this page`}
                    </p>
                </div>
                <Link to="/scans/new">
                    <Button
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

            <Card>
                <div
                    className="grid grid-cols-[1fr_100px_140px] gap-4 px-5 py-2.5 border-b border-zinc-800 text-xs text-zinc-600 uppercase tracking-wider">
                    <span>Target</span>
                    <span className="text-center">Status</span>
                    <span className="text-center">Created</span>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Spinner/>
                    </div>
                ) : scans.length === 0 ? (
                    <EmptyState
                        icon="🔍"
                        title="No scans yet"
                        description="Submit your first scan to get started."
                        action={
                            <Link to="/scans/new">
                                <Button size="sm">New Scan</Button>
                            </Link>
                        }
                    />
                ) : (
                    <ul className="divide-y divide-zinc-800/60">
                        {scans.map((scan) => <ScanRow key={scan.scanId} scan={scan}/>)}
                    </ul>
                )}

                {(hasPrevPage || hasNextPage) && (
                    <div className="px-5 py-3 border-t border-zinc-800 flex items-center justify-between">
                        <p className="text-xs text-zinc-600">
                            {hasPrevPage ? `Page ${page + 1}` : "First page"}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={!hasPrevPage}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={!hasNextPage}
                                loading={isFetching}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

function ScanRow({scan}: { scan: Scan }) {
    return (
        <li>
            <Link
                to={`/scans/${scan.scanId}`}
                className="grid grid-cols-[1fr_100px_140px] gap-4 items-center px-5 py-3.5 hover:bg-zinc-800/40 transition-colors"
            >
                <span className="text-sm font-medium hover:text-copper-400 text-zinc-200 truncate">{scan.target}</span>
                <div className="flex justify-center">
                    <StatusBadge status={scan.status}/>
                </div>
                <span className="text-xs text-zinc-600 text-center">
                    {formatDate(scan.createdAt, true)}
                </span>
            </Link>
        </li>
    );
}
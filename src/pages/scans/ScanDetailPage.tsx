import {useState} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {scanApi} from "../../api/scans";
import {Button, Card, StatusBadge, Spinner, Alert} from "../../components/ui";
import {ReportDownload} from "../../components/ReportDownload";
import {formatDate} from "../../utils/format";
import type {ScanStatus} from "../../types";

const ACTIVE_STATUSES: ScanStatus[] = ["ACCEPTED", "QUEUED", "STARTED", "PENDING"];

export function ScanDetailPage() {
    const {scanId} = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [reportError, setReportError] = useState("");

    const {data: scan, isLoading} = useQuery({
        queryKey: ["scan", scanId],
        queryFn: () => scanApi.get(scanId!),
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status && ACTIVE_STATUSES.includes(status) ? 3000 : false;
        },
        enabled: !!scanId,
    });

    const {data: result} = useQuery({
        queryKey: ["scan-result", scanId],
        queryFn: () => scanApi.getResult(scanId!),
        enabled: scan?.status === "FINISHED",
    });

    const deleteMutation = useMutation({
        mutationFn: () => scanApi.delete(scanId!),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["scans"]});
            navigate("/scans");
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner size="lg"/>
            </div>
        );
    }

    if (!scan) {
        return (
            <div className="p-8 text-center text-zinc-500">
                Scan not found.{" "}
                <Link to="/scans" className="text-indigo-400 hover:text-indigo-300">
                    Back to scans
                </Link>
            </div>
        );
    }

    const scanOutput = result?.scanOutput;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
                <Link to="/scans" className="hover:text-zinc-400 transition-colors">Scans</Link>
                <span>/</span>
                <span className="text-zinc-400 font-mono">{scanId}</span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-xl font-semibold text-zinc-100 font-mono truncate">
                            {scan.target}
                        </h1>
                        <StatusBadge status={scan.status}/>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">
                        Created: {formatDate(scan.createdAt, true)}
                    </p>
                </div>

                {/* Controls: inline report download + delete */}
                <div className="flex items-center gap-3 shrink-0">
                    {scan.status === "FINISHED" && (
                        <ReportDownload
                            scanId={scanId!}
                            inline
                            onError={setReportError}
                        />
                    )}
                    {confirmDelete ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">Sure?</span>
                            <Button
                                variant="danger"
                                size="sm"
                                loading={deleteMutation.isPending}
                                onClick={() => deleteMutation.mutate()}
                            >
                                Yes, delete
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {/* Report download errors (if any) */}
            {reportError && (
                <Alert variant="error" message={reportError}/>
            )}

            {/* Scan output */}
            {scanOutput ? (
                <Card>
                    <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Raw Output
                        </h2>
                        <button
                            className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
                            onClick={() => navigator.clipboard.writeText(scanOutput)}
                        >
                            Copy
                        </button>
                    </div>
                    <pre
                        className="p-5 text-xs text-emerald-500 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[70vh] overflow-y-auto bg-zinc-950/50 rounded-b-xl">
                        {scanOutput}
                    </pre>
                </Card>
            ) : ACTIVE_STATUSES.includes(scan.status) ? (
                <Card className="p-8 flex flex-col items-center gap-3 text-center">
                    <Spinner size="lg"/>
                    <p className="text-zinc-400 text-sm">Scan in progress...</p>
                </Card>
            ) : scan.status === "FAILED" ? (
                <Card className="p-8 text-center">
                    <p className="text-red-400 text-sm">Scan failed. No results available.</p>
                    {scan.errorMessage && (
                        <p className="text-xs text-zinc-500 mt-2">{scan.errorMessage}</p>
                    )}
                </Card>
            ) : null}
        </div>
    );
}
import { useState } from "react";
import { reportApi } from "../api/scans";
import { Alert, Spinner } from "./ui";
import type { ReportFormat } from "../types";
import {metalClass, MetallicLayers} from "../styles/metallic";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
    scanId: string;
    inline?: boolean;      // If true, render only the control strip (no outer div, no error alert)
    onError?: (error: string) => void; // Forward download errors to parent
}

// ─── Format definitions ───────────────────────────────────────────────────────

const FORMATS: { id: ReportFormat; label: string }[] = [
    { id: "PDF",  label: "PDF"  },
    { id: "HTML", label: "HTML" },
    { id: "DOCX", label: "Word" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function DownloadIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportDownload({ scanId, inline = false, onError }: Props) {
    const [selected, setSelected] = useState<ReportFormat>("PDF");
    const [loading,  setLoading]  = useState(false);
    const [done,     setDone]     = useState(false);
    const [error,    setError]    = useState("");

    const handleDownload = async () => {
        setError("");
        if (onError) onError("");
        setDone(false);
        setLoading(true);
        try {
            await reportApi.download(scanId, selected);
            setDone(true);
            setTimeout(() => setDone(false), 2500);
        } catch (err: unknown) {
            const msg =
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message: unknown }).message)
                    : "Failed to download report.";
            setError(msg);
            if (onError) onError(msg);
        } finally {
            setLoading(false);
        }
    };

    const controlStrip = (
        <div className="flex items-center gap-2">
            {/* Format picker */}
            <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 gap-0.5">
                {FORMATS.map((fmt) => (
                    <button
                        key={fmt.id}
                        onClick={() => { setSelected(fmt.id); setDone(false); }}
                        disabled={loading}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${selected === fmt.id
                            ? "bg-zinc-800 text-zinc-100 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        {fmt.label}
                    </button>
                ))}
            </div>

            {/* Download button */}
            <button
                onClick={handleDownload}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
                    transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                    ${done
                    ? "bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    : metalClass()
                }`}
            >
                {done ? (
                    <CheckIcon />
                ) : (
                    <MetallicLayers>
                        {loading ? <Spinner size="sm" /> : <DownloadIcon />}
                    </MetallicLayers>
                )}
            </button>
        </div>
    );

    if (inline) {
        // In inline mode, render just the control strip (no wrapper, no error alert)
        return controlStrip;
    }

    return (
        <div className="flex flex-col gap-2">
            {error && <Alert variant="error" message={error} />}
            {controlStrip}
        </div>
    );
}
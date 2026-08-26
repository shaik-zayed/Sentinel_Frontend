import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {scanApi} from "../../api/scans";
import {Button, Input, Select, Toggle, Alert, Card} from "../../components/ui";
import type {ScanRequest} from "../../types";

const defaultForm: ScanRequest = {
    target: "",
    scanMode: "LIGHT",
    protocol: "TCP",
    portMode: "COMMON",
    portValue: "top-100",
    detectOs: false,
    detectServiceVersion: false,
};

// Improved validation with edge‑case handling
function validatePortList(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return "Port list cannot be empty.";

    // Allowed characters: digits, commas, hyphens (and whitespace, which we strip)
    if (!/^[\d,\s-]+$/.test(trimmed)) {
        return "Invalid characters. Use only numbers, commas, and hyphens.";
    }

    const parts = trimmed.split(",").map(p => p.trim());
    if (parts.some(p => p === "")) {
        return "Empty port entry found (e.g., trailing comma or double comma).";
    }

    const seenPorts = new Set<number>();

    for (const part of parts) {
        // Check for multiple hyphens (e.g., "80-90-100")
        if ((part.match(/-/g) || []).length > 1) {
            return `Invalid range: "${part}". Use format "start-end".`;
        }

        if (part.includes("-")) {
            // Range format
            const [startStr, endStr] = part.split("-");
            if (!startStr || !endStr) {
                return `Invalid range: "${part}". Use format "start-end".`;
            }
            const start = Number(startStr);
            const end = Number(endStr);
            if (isNaN(start) || isNaN(end) || !Number.isInteger(start) || !Number.isInteger(end)) {
                return `Invalid numbers in range: "${part}".`;
            }
            if (start < 1 || start > 65535) return `Start port ${start} is out of range (1–65535).`;
            if (end < 1 || end > 65535) return `End port ${end} is out of range (1–65535).`;
            if (start > end) return `Start port (${start}) cannot be greater than end port (${end}).`;
            for (let p = start; p <= end; p++) {
                if (seenPorts.has(p)) return `Duplicate port ${p} detected.`;
                seenPorts.add(p);
            }
        } else {
            const port = Number(part);
            if (isNaN(port) || !Number.isInteger(port)) return `Invalid port number: "${part}".`;
            if (port < 1 || port > 65535) return `Port ${port} is out of range (1–65535).`;
            if (seenPorts.has(port)) return `Duplicate port ${port} detected.`;
            seenPorts.add(port);
        }
    }
    return null;
}

export function NewScanPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<ScanRequest>(defaultForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [portError, setPortError] = useState("");
    const [deepUdpWarning, setDeepUdpWarning] = useState(false);

    const set = <K extends keyof ScanRequest>(key: K, value: ScanRequest[K]) =>
        setForm((f) => ({...f, [key]: value}));

    // ── Derived state ────────────────────────────────────────────────────────
    const isDeepTcp = form.scanMode === "DEEP" && form.protocol === "TCP";
    // DEEP+TCP: both forced ON and locked
    const osDetectLocked = isDeepTcp;
    const serviceDetectLocked = isDeepTcp;
    // LIGHT+UDP: OS Detection unsupported
    const osDetectDisabled = form.protocol === "UDP";

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleScanModeChange = (mode: ScanRequest["scanMode"]) => {
        setDeepUdpWarning(false);

        if (mode === "DEEP" && form.protocol === "UDP") {
            // DEEP+UDP is invalid — stay on LIGHT and warn
            setDeepUdpWarning(true);
            return;
        }

        setForm(f => ({
            ...f,
            scanMode: mode,
            // DEEP+TCP auto-enables both detections
            detectOs: mode === "DEEP" ? true : f.detectOs,
            detectServiceVersion: mode === "DEEP" ? true : f.detectServiceVersion,
        }));
    };

    const handleProtocolChange = (protocol: ScanRequest["protocol"]) => {
        setDeepUdpWarning(false);

        if (protocol === "UDP" && form.scanMode === "DEEP") {
            // DEEP+UDP is invalid — revert scan mode to LIGHT and warn
            setDeepUdpWarning(true);
            setForm(f => ({
                ...f,
                protocol,
                scanMode: "LIGHT",
                detectOs: false,
                detectServiceVersion: f.detectServiceVersion,
            }));
            return;
        }

        setForm(f => ({
            ...f,
            protocol,
            // UDP does not support OS Detection
            detectOs: protocol === "UDP" ? false : f.detectOs,
        }));
    };

    const handlePortValueChange = (value: string) => {
        set("portValue", value);
        if (form.portMode === "LIST") {
            const err = validatePortList(value);
            setPortError(err || "");
        } else {
            setPortError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.portMode === "LIST") {
            const err = validatePortList(form.portValue);
            if (err) {
                setPortError(err);
                return;
            }
        }

        setLoading(true);
        try {
            const response = await scanApi.submit(form);
            navigate(`/scans/${response.scanId}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to submit scan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-zinc-100">New Scan</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Configure and launch a network scan.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {error && <Alert variant="error" message={error}/>}

                {/* Target */}
                <Card className="p-5 flex flex-col gap-4">
                    <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Target</h2>
                    <Input
                        label="Host / IP Address"
                        placeholder="192.168.1.1 or example.com"
                        value={form.target}
                        onChange={(e) => set("target", e.target.value)}
                        required
                        hint="Enter an IP address, hostname, or CIDR range."
                    />
                </Card>

                {/* Scan Settings */}
                <Card className="p-5 flex flex-col gap-4">
                    <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Scan Settings</h2>

                    {deepUdpWarning && (
                        <Alert
                            variant="warning"
                            message="Deep Scan is not supported with UDP. Scan mode has been reverted to Light."
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Scan Mode"
                            value={form.scanMode}
                            onChange={(e) => handleScanModeChange(e.target.value as ScanRequest["scanMode"])}
                            options={[
                                {value: "LIGHT", label: "Light Scan : fast and basic"},
                                {value: "DEEP", label: "Deep Scan : thorough but slower"},
                            ]}
                        />
                        <Select
                            label="Protocol"
                            value={form.protocol}
                            onChange={(e) => handleProtocolChange(e.target.value as ScanRequest["protocol"])}
                            options={[
                                {value: "TCP", label: "TCP"},
                                {value: "UDP", label: "UDP"},
                            ]}
                        />
                    </div>
                </Card>

                {/* Port Settings */}
                <Card className="p-5 flex flex-col gap-4">
                    <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Port Settings</h2>

                    <Select
                        label="Port Mode"
                        value={form.portMode}
                        onChange={(e) => {
                            const mode = e.target.value as ScanRequest["portMode"];
                            set("portMode", mode);
                            if (mode === "COMMON") {
                                set("portValue", "top-100");
                                setPortError("");
                            } else {
                                set("portValue", "");
                            }
                        }}
                        options={[
                            {value: "COMMON", label: "Common ports"},
                            {value: "LIST", label: "Custom list"},
                        ]}
                    />

                    {form.portMode === "COMMON" && (
                        <Select
                            label="Port Profile"
                            value={form.portValue}
                            onChange={(e) => set("portValue", e.target.value)}
                            options={[
                                {value: "top-100", label: "Top 100 ports"},
                                {value: "top-1000", label: "Top 1000 ports"},
                            ]}
                        />
                    )}

                    {form.portMode === "LIST" && (
                        <Input
                            label="Port List"
                            placeholder="22,80,443,8080-8090"
                            value={form.portValue}
                            onChange={(e) => handlePortValueChange(e.target.value)}
                            error={portError}
                            hint="Comma-separated ports or ranges (e.g. 80,443,8000-9000)."
                        />
                    )}
                </Card>

                {/* Detection */}
                <Card className="p-5 flex flex-col gap-4">
                    <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Detection</h2>

                    {isDeepTcp && (
                        <Alert
                            variant="info"
                            message="Deep Scan uses -A flag — OS and Service Detection are enabled automatically."
                        />
                    )}

                    <Toggle
                        label="OS Detection"
                        hint={
                            osDetectDisabled
                                ? "OS Detection is not supported with UDP."
                                : osDetectLocked
                                    ? "Enabled automatically by Deep Scan (-A)."
                                    : "Attempt to identify the operating system."
                        }
                        checked={osDetectLocked ? true : form.detectOs}
                        onChange={(v) => !osDetectLocked && !osDetectDisabled && set("detectOs", v)}
                        disabled={osDetectDisabled || osDetectLocked}
                    />

                    <Toggle
                        label="Service Version Detection"
                        hint={
                            serviceDetectLocked
                                ? "Enabled automatically by Deep Scan (-A)."
                                : "Probe open ports to determine service and version info."
                        }
                        checked={serviceDetectLocked ? true : form.detectServiceVersion}
                        onChange={(v) => !serviceDetectLocked && set("detectServiceVersion", v)}
                        disabled={serviceDetectLocked}
                    />
                </Card>

                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={() => navigate("/scans")}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={loading}
                        size="lg"
                        disabled={form.portMode === "LIST" && !!portError}
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        }
                    >
                        Launch Scan
                    </Button>
                </div>
            </form>
        </div>
    );
}
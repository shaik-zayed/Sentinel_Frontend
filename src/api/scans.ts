import { apiRequest, tokenStore } from "./client";
import { BASE_URL } from "../config";
import type {
    Scan,
    ScanRequest,
    ScanResult,
    ScanStatus,
    ReportFormat,
    ScanSubmissionResponse,
} from "../types";

export const scanApi = {
    submit: (data: ScanRequest) =>
        apiRequest<ScanSubmissionResponse>("/api/v1/scan/submit", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    get: (scanId: string) =>
        apiRequest<Scan>(`/api/v1/scan/${scanId}`),

    getStatus: (scanId: string) =>
        apiRequest<{ status: ScanStatus }>(`/api/v1/scan/${scanId}/status`),

    getResult: (scanId: string) =>
        apiRequest<ScanResult>(`/api/v1/scan/${scanId}/result`),

    list: (limit = 20, pageNumber = 0) =>
        apiRequest<Scan[]>("/api/v1/scan/list", {
            params: { limit, page: pageNumber },
        }),

    delete: (scanId: string) =>
        apiRequest<void>(`/api/v1/scan/${scanId}`, { method: "DELETE" }),
};

export const reportApi = {
    download: async (scanId: string, format: ReportFormat): Promise<void> => {
        const token = tokenStore.getAccess();

        const res = await fetch(
            `${BASE_URL}/api/v1/report/${scanId}/download?format=${format.toLowerCase()}`,
            {
                headers: {
                    Authorization: `Bearer ${token ?? ""}`
                },
            }
        );

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: res.statusText }));
            throw error;
        }

        const blob      = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const anchor    = document.createElement("a");
        anchor.href     = objectUrl;
        anchor.download = `sentinel-report-${scanId}.${format.toLowerCase()}`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(objectUrl);
    },
};
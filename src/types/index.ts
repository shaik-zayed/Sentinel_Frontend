// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: "USER" | "ADMIN";
    enabled: boolean;
    locked: boolean;
    emailVerified: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// ─── Scans ────────────────────────────────────────────────────────────────────

export type ScanStatus =
    | "ACCEPTED"
    | "QUEUED"
    | "STARTED"
    | "PENDING"
    | "FINISHED"
    | "FAILED"
    | "CANCELLED";

export type ScanMode = "LIGHT" | "DEEP";
export type Protocol = "TCP" | "UDP";
export type PortMode = "COMMON" | "LIST";

export interface ScanRequest {
    target: string;
    scanMode: ScanMode;
    protocol: Protocol;
    portMode: PortMode;
    portValue: string;
    detectOs: boolean;
    detectServiceVersion: boolean;
}

export interface Scan {
    scanId: string;
    status: ScanStatus;
    target: string;
    createdAt: string;
    updatedAt?: string;
    completedAt?: string;
    executionTimeMs?: number;
    errorMessage?: string;
    scanOutput?: string;
    scanCommand?: string[];
    // Optional — not always returned by the backend
    scanMode?: ScanMode;
    protocol?: Protocol;
    portMode?: PortMode;
    portValue?: string;
    detectOs?: boolean;
    detectServiceVersion?: boolean;
}

export interface ScanResult {
    scanId: string;
    scanOutput: string;
}

export interface ScanSubmissionResponse {
    scanId: string;
    status: string;
    message: string;
    statusUrl: string;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export type ReportFormat = "PDF" | "HTML" | "DOCX";

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiError {
    message: string;
    status: number;
}
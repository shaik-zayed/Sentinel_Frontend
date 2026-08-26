import React from "react";
import {type ScanStatus} from "../../types";
import {metalClass, MetallicBackdrop, MetallicLayers} from "../../styles/metallic.tsx";

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        metalClass(),
    // "bg-copper-600 hover:bg-copper-500 text-white border border-copper-500 shadow-sm shadow-copper-900/40",
    secondary:
        "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
    ghost:
        "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-transparent",
    danger:
        "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs rounded-sm",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-5 py-2.5 text-sm rounded-lg",
};

export function Button({
                           variant = "primary",
                           size = "md",
                           loading,
                           icon,
                           children,
                           className = "",
                           disabled,
                           ...props
                       }: ButtonProps) {
    const isMetal = variant === "primary";
    return (
        <button
            disabled={disabled || loading}
            className={`inline-flex items-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none ${
                isMetal ? "" : "focus:ring-2 focus:ring-copper-500/50"
            } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {isMetal ? (
                <MetallicLayers>
                    {loading ? <Spinner size="sm"/> : icon}
                    {children}
                </MetallicLayers>
            ) : (
                <>
                    {loading ? <Spinner size="sm"/> : icon}
                    {children}
                </>
            )}
        </button>
    );
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Input({
                          label,
                          error,
                          hint,
                          leftIcon,
                          className = "",
                          id,
                          ...props
                      }: InputProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        {leftIcon}
                    </span>
                )}
                <input
                    id={inputId}
                    className={`w-full bg-zinc-900 border ${
                        error ? "border-red-600" : "border-zinc-700"
                    } text-zinc-100 placeholder-zinc-600 rounded-lg py-2.5 pr-3 ${
                        leftIcon ? "pl-9" : "pl-3"
                    } text-sm transition focus:outline-none focus:border-copper-500 focus:ring-1 focus:ring-copper-500/40 ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {hint && !error && <p className="text-xs text-zinc-600">{hint}</p>}
        </div>
    );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export function Select({label, error, options, className = "", id, ...props}: SelectProps) {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`w-full bg-zinc-900 border ${
                    error ? "border-red-600" : "border-zinc-700"
                } text-zinc-100 rounded-lg py-2.5 px-3 text-sm transition focus:outline-none focus:border-copper-500 focus:ring-1 focus:ring-copper-500/40 ${className}`}
                {...props}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    hint?: string;
    disabled?: boolean;
}

export function Toggle({label, checked, onChange, hint, disabled = false}: ToggleProps) {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <div className={`flex items-center justify-between gap-3 ${disabled ? "opacity-50" : ""}`}>
            <div className="flex-1">
                <p className={`text-sm ${disabled ? "text-zinc-500" : "text-zinc-200"}`}>
                    {label}
                </p>
                {hint && <p className="text-xs text-zinc-600 mt-0.5">{hint}</p>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={handleToggle}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                    checked ? `${metalClass('copper', true)} focus:ring-copper-400` : "bg-zinc-700 focus:ring-copper-500"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
                {checked && <MetallicBackdrop/>}
                <span
                    aria-hidden="true"
                    className={`pointer-events-none relative z-[3] inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        checked ? "translate-x-4" : "translate-x-0"
                    }`}
                />
            </button>
        </div>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({children, className = "", hover}: CardProps) {
    return (
        <div
            className={`bg-zinc-900 border border-zinc-800 rounded-xl ${
                hover ? "hover:border-zinc-700 transition-colors" : ""
            } ${className}`}
        >
            {children}
        </div>
    );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

const statusConfig: Record<ScanStatus, { label: string; className: string; dot: string }> = {
    ACCEPTED: {
        label: "Accepted",
        className: "bg-slate-900/60 text-slate-400 border-slate-700",
        dot: "bg-slate-400",
    },
    QUEUED: {
        label: "Queued",
        className: "bg-amber-950/40 text-amber-400 border-amber-800/60",
        dot: "bg-amber-400",
    },
    STARTED: {
        label: "Running",
        className: "bg-sky-950/40 text-sky-400 border-sky-800/60",
        dot: "bg-sky-400 animate-pulse",
    },
    PENDING: {
        label: "Pending",
        className: "bg-slate-900/60 text-slate-400 border-slate-700",
        dot: "bg-slate-400 animate-pulse",
    },
    FINISHED: {
        label: "Finished",
        className: "bg-emerald-950/40 text-emerald-500 border-emerald-800/60",
        dot: "bg-emerald-400",
    },
    FAILED: {
        label: "Failed",
        className: "bg-rose-950/40 text-rose-400 border-rose-800/60",
        dot: "bg-rose-400",
    },
    CANCELLED: {
        label: "Cancelled",
        className: "bg-slate-900/60 text-slate-500 border-slate-700",
        dot: "bg-slate-500",
    },
};

export function StatusBadge({status}: { status: ScanStatus }) {
    const cfg = statusConfig[status];
    if (!cfg) return null;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
            {cfg.label}
        </span>
    );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({size = "md"}: { size?: "sm" | "md" | "lg" }) {
    const s = {sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7"}[size];
    return (
        <svg
            className={`animate-spin text-current ${s}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({
                               icon,
                               title,
                               description,
                               action,
                           }: {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div
                className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-2xl">
                {icon}
            </div>
            <div>
                <p className="text-zinc-300 font-medium">{title}</p>
                {description && <p className="text-zinc-600 text-sm mt-1">{description}</p>}
            </div>
            {action}
        </div>
    );
}

// ─── Alert ────────────────────────────────────────────────────────────────────

export function Alert({
                          variant = "error",
                          message,
                      }: {
    variant?: "error" | "success" | "info" | "warning";
    message: string;
}) {
    const styles = {
        error: "bg-red-900/20 border-red-800/50 text-red-300",
        success: "bg-emerald-900/20 border-emerald-800/50 text-emerald-300",
        info: "bg-copper-900/20 border-copper-800/50 text-copper-300",
        warning: "bg-yellow-900/20 border-yellow-800/50 text-yellow-300"
    };
    return (
        <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}>
            {message}
        </div>
    );
}
/**
 * Formats an ISO date string into a human-readable form.
 * @param iso   - ISO 8601 date string
 * @param withTime - include hour/minute (default false)
 */
export function formatDate(iso: string, withTime = false): string {
    return new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        ...(withTime && {hour: "2-digit", minute: "2-digit"}),
    });
}
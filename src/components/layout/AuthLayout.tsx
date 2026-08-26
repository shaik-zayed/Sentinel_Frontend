import {Link, Outlet} from "react-router-dom";
import {metalClass, MetallicLayers} from "../../styles/metallic.tsx";

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            {/* Subtle grid background */}
            <div
                className="fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            <div className="relative w-full max-w-sm">
                <Link to="/" className="flex items-center gap-2.5 justify-center" aria-label="Go to landing page">
                    <div className="flex items-center gap-2.5 mb-8 justify-center">
                        <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${metalClass('copper', true)}`}>
                            <MetallicLayers>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </MetallicLayers>
                        </div>
                        <span className="text-base font-semibold text-zinc-100 tracking-tight">Sentinel</span>
                    </div>
                </Link>
                <Outlet/>
            </div>
        </div>
    );
}
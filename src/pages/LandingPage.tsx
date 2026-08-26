import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {metalClass, MetallicLayers} from "../styles/metallic";
import styles from "../styles/metallic.module.css";
import {CopperLink} from "../styles/CopperButton.tsx";

// ─── Animated scan line effect ────────────────────────────────────────────────
function ScanAnimation() {
    return (
        <div className="relative w-full max-w-lg mx-auto h-64 select-none">
            {/* Grid */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />
            {/* Scan line */}
            <div
                className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-copper-400 to-transparent opacity-80"
                style={{animation: "scanline 2.5s linear infinite", top: 0}}
            />
            {/* Terminal lines */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 font-mono text-xs gap-2">
                <TerminalLine delay={0} text="$ sentinel scan --target 192.168.1.0/24 --mode deep"/>
                <TerminalLine delay={0.4} text="> Resolving hosts..." color="text-zinc-500"/>
                <TerminalLine delay={0.8} text="> PORT    STATE  SERVICE    VERSION" color="text-zinc-400"/>
                <TerminalLine delay={1.2} text="> 22/tcp  open   ssh        OpenSSH 8.9p1" color="text-emerald-500"/>
                <TerminalLine delay={1.6} text="> 80/tcp  open   http       nginx 1.24.0" color="text-emerald-500"/>
                <TerminalLine delay={2.0} text="> 443/tcp open   https      nginx 1.24.0" color="text-emerald-500"/>
                <TerminalLine delay={2.4} text="> 3306/tcp open  mysql      8.0.33" color="text-amber-400"/>
                <TerminalLine delay={2.8} text="> Scan complete. 4 open ports found." color="text-gold-400"/>
            </div>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-copper-500/60"/>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-copper-500/60"/>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-copper-500/60"/>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-copper-500/60"/>
        </div>
    );
}

function TerminalLine({text, delay, color = "text-zinc-300"}: {
    text: string;
    delay: number;
    color?: string;
}) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay * 1000);
        return () => clearTimeout(t);
    }, [delay]);
    return (
        <div
            className={`transition-all duration-300 ${color} ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            }`}
        >
            {text}
        </div>
    );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
                         icon,
                         title,
                         description,
                     }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div
            className="group relative p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-copper-500/40 hover:bg-zinc-900 transition-all duration-300">
            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${metalClass('copper', true)}`}>
                <MetallicLayers>{icon}</MetallicLayers>
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
        </div>
    );
}

// ─── Step ─────────────────────────────────────────────────────────────────────
function Step({number, title, description}: {
    number: string;
    title: string;
    description: string
}) {
    return (
        <div className="flex gap-5">
            <span
                className={`shrink-0 w-7 h-7 rounded-[3px] font-mono flex items-center justify-center text-xs font-bold mt-0.5 ${metalClass('copper', true)}`}>
                <MetallicLayers>{number}</MetallicLayers>
            </span>
            <div>
                <p className="text-sm font-semibold text-zinc-100">{title}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{description}</p>
            </div>
        </div>
    );
}

// ─── Main landing page ────────────────────────────────────────────────────────
export function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
            <style>{`
                @keyframes scanline {
                    0% { top: 0%; opacity: 0; }
                    5% { opacity: 0.8; }
                    95% { opacity: 0.8; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.6s ease forwards; }
                .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
                .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
                .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
                .fade-up-4 { animation-delay: 0.55s; opacity: 0; }
            `}</style>

            {/* Navbar – fixed, no grid behind it */}
            <header
                className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 md:px-10 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${metalClass('copper', true)}`}>
                        <MetallicLayers>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                        </MetallicLayers>
                    </div>
                    <span className="text-md font-semibold tracking-tight">Sentinel</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5"
                    >
                        Sign in
                    </Link>
                    <CopperLink to="/register" size="nav">
                        Get started
                    </CopperLink>
                </div>
            </header>

            {/* Main content area – grid background applied only here */}
            <div className="relative">
                {/* Grid pattern layer – behind the sections, not affecting child opacity */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        opacity: 0.025,
                    }}
                />
                {/* Content wrapper – elevated above the grid */}
                <div className="relative z-10">
                    {/* Hero */}
                    <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
                        {/* Background glow */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-copper-600/10 rounded-full blur-3xl pointer-events-none"/>

                        <div className="relative max-w-3xl mx-auto">
                            <div
                                className="fade-up fade-up-1 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-copper-500/60 bg-copper-950/60 text-xs text-copper-400 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-copper-400 animate-pulse"/>
                                Network intelligence platform
                            </div>

                            <h1 className="fade-up fade-up-2 text-4xl md:text-6xl font-bold tracking-tight text-zinc-100 leading-tight mb-6">
                                Scan. Analyze.{" "}
                                <span className={styles.textShine}>
                                    Secure.
                                </span>
                            </h1>

                            <p className="fade-up fade-up-3 text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10">
                                Sentinel gives you deep visibility into your network
                                by port scanning, service detection, OS fingerprinting, and automated reports with
                                latest CVE's in one place.
                            </p>

                            <div className="fade-up fade-up-4 flex items-center justify-center gap-4 flex-wrap">
                                <CopperLink to="/register">
                                    Create free account
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                    </svg>
                                </CopperLink>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium rounded-md border border-zinc-700 transition-all text-sm"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Terminal demo */}
                    <section className="pb-24 px-6">
                        <div className="max-w-2xl mx-auto">
                            <div
                                className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl shadow-black/40">
                                {/* Window chrome */}
                                <div
                                    className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                                    <div className="w-3 h-3 rounded-full bg-zinc-700"/>
                                    <div className="w-3 h-3 rounded-full bg-zinc-700"/>
                                    <div className="w-3 h-3 rounded-full bg-zinc-700"/>
                                    <span className="ml-3 text-xs text-zinc-600 font-mono">sentinel — scan</span>
                                </div>
                                <div className="p-6">
                                    <ScanAnimation/>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="pb-24 px-6">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-3">
                                    Everything you need
                                </h2>
                                <p className="text-zinc-500 text-sm max-w-md mx-auto">
                                    From quick surface scans to deep network audits. All results stored, searchable, and
                                    exportable.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FeatureCard
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                        </svg>
                                    }
                                    title="Port Scanning"
                                    description="Scan common ports or define custom ranges. Supports TCP and UDP across any IP, hostname, or CIDR block."
                                />
                                <FeatureCard
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
                                        </svg>
                                    }
                                    title="Service Detection"
                                    description="Identify running services and their versions. Know exactly what's exposed on every open port."
                                />
                                <FeatureCard
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    }
                                    title="OS Fingerprinting"
                                    description="Detect the operating system of target hosts using active probing techniques."
                                />
                                {/*<FeatureCard*/}
                                {/*    icon={*/}
                                {/*        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                                {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}*/}
                                {/*                  d="M13 10V3L4 14h7v7l9-11h-7z"/>*/}
                                {/*        </svg>*/}
                                {/*    }*/}
                                {/*    title="Light & Deep Modes"*/}
                                {/*    description="Choose a fast surface scan or a thorough deep scan depending on your time and coverage needs."*/}
                                {/*/>*/}
                                <FeatureCard
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                    }
                                    title="Automated Reports"
                                    description="Export scan results as PDF, HTML, or DOCX with one click. Share findings with your team instantly."
                                />
                                {/*<FeatureCard*/}
                                {/*    icon={*/}
                                {/*        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                                {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}*/}
                                {/*                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>*/}
                                {/*        </svg>*/}
                                {/*    }*/}
                                {/*    title="Secure by Default"*/}
                                {/*    description="JWT-based auth with refresh tokens, email verification, and per-device session management."*/}
                                {/*/>*/}
                            </div>
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="pb-24 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div
                                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 md:p-14 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-100 mb-2">Get started in minutes</h2>
                                    <p className="text-zinc-500 text-sm mb-8">No setup required. Create an account and
                                        run your
                                        first scan immediately.</p>
                                    <div className="flex flex-col gap-6">
                                        <Step number="01" title="Create an account"
                                              description="Register with your email and verify it to activate your account."/>
                                        <Step number="02" title="Submit a scan"
                                              description="Enter a target, pick your scan mode and protocol, and launch."/>
                                        <Step number="03" title="Review results"
                                              description="Get real-time status updates and view detailed output when complete."/>
                                        <Step number="04" title="Export your report"
                                              description="Download findings as PDF, HTML, or DOCX to share with stakeholders."/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                                        <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-3">Scan
                                            summary</p>
                                        <div className="space-y-2.5">
                                            {[
                                                {label: "Target", value: "192.168.1.0/24"},
                                                {label: "Mode", value: "Deep"},
                                                {label: "Protocol", value: "TCP"},
                                                {label: "Ports", value: "Common"},
                                                {label: "OS Detection", value: "Enabled"},
                                            ].map((row) => (
                                                <div key={row.label}
                                                     className="flex items-center justify-between text-sm">
                                                    <span className="text-zinc-600">{row.label}</span>
                                                    <span className="text-zinc-300 font-mono text-xs">{row.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400"/>
                                            <span
                                                className="text-xs text-emerald-500">Scan finished — 12 hosts, 47 open ports</span>
                                        </div>
                                    </div>
                                    <CopperLink to="/register" className="w-full">
                                        Start scanning now
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                        </svg>
                                    </CopperLink>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer – no grid */}
            <footer className="border-t border-zinc-800 px-6 py-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-5 h-5 rounded flex items-center justify-center ${metalClass('copper', true)}`}>
                            <MetallicLayers>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </MetallicLayers>
                        </div>
                        <span className="text-sm font-semibold text-zinc-400">Sentinel</span>
                    </div>
                    <p className="text-xs text-zinc-500">Network intelligence. Built for security teams.</p>
                    <div className="flex gap-5 text-xs text-zinc-600">
                        <Link to="/login" className="hover:text-zinc-400 transition-colors">Sign in</Link>
                        <Link to="/register" className="hover:text-zinc-400 transition-colors">Register</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
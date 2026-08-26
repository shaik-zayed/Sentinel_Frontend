import {Link, NavLink, Outlet, useNavigate} from "react-router-dom";
import {useAuthStore} from "../../store/authStore";
import {metalClass, MetallicLayers} from "../../styles/metallic.tsx";

const NAV_ITEMS = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
        ),
    },
    {
        to: "/scans",
        label: "Scans",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
            </svg>
        ),
    },
    {
        to: "/scans/new",
        label: "New Scan",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
            </svg>
        ),
    },
    {
        to: "/reports",
        label: "Reports",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
        ),
    },
];

export function AppLayout() {
    const {user, logout} = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-950">
                {/* Logo */}
                <NavLink
                    to="/dashboard"
                    prefetch="intent"
                    className="h-14 flex items-center px-5 border-b border-zinc-800 hover:bg-zinc-900 transition-colors"
                >
                    <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${metalClass('copper', true)}`}>
                            <MetallicLayers>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </MetallicLayers>
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-zinc-100">Sentinel</span>
                    </div>
                </NavLink>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-0.5">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            prefetch="intent"
                            end={item.to === "/dashboard" || item.to === "/scans"}
                            className={({isActive}) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-100 ${
                                    isActive
                                        ? "bg-zinc-800 text-zinc-100"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className="border-t border-zinc-800 p-3">
                    <Link
                        to="/me"
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                    >
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${metalClass('copper', true)}`}>
                            <MetallicLayers>{user?.firstName?.[0]?.toUpperCase() ?? "?"}</MetallicLayers>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{user?.firstName}</p>
                            <p className="text-xs text-zinc-600 truncate">{user?.email}</p>
                        </div>
                    </Link>

                    <div className="mt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-600 hover:text-red-500 hover:bg-zinc-900 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <Outlet/>
            </main>
        </div>
    );
}
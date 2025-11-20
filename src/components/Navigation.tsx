import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Moon, Sun } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCommunication } from "../contexts/CommunicationContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./UI/Button";

const Navigation: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { unreadLeadsCount, unreadResponsesCount } = useCommunication();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Calculate total unread count
  const totalUnreadCount = unreadLeadsCount + unreadResponsesCount;

  // Build navigation based on user permissions (simplified for React version)
  const navigation = useMemo(() => [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    // {
    //   name: "Inbox",
    //   href: "/inbox",
    //   icon: "📬",
    //   badge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
    // },
    // { name: "Leads", href: "/leads", icon: "📋" },
    {
      name: "Madaris",
      href: "/madaris/dashboard",
      icon: "🏢",
      children: [
        { name: "Dashboard", href: "/madaris/dashboard" },
        { name: "List", href: "/madaris/list" },
        { name: "Non Cooperative", href: "/madaris/non-cooperative" },
        { name: "Action Against Illegal Madaris", href: "/madaris/action-against-illegal-madaris" },
      ],
    },
    {
      name: "Safe City",
      href: "/safe-city/dashboard",
      icon: "🏙️",
      children: [
        { name: "Dashboard", href: "/safe-city/dashboard" },
        { name: "List", href: "/safe-city/list" },
      ],
    },
    {
      name: "NGO's",
      href: "/ngo/dashboard",
      icon: "🤝",
      children: [
        { name: "Dashboard", href: "/ngo/dashboard" },
        { name: "List", href: "/ngo/list" },
      ],
    },
    {
      name: "Ops & response",
      href: "/ops-response/dashboard",
      icon: "⚡",
      children: [
        { name: "Dashboard", href: "/ops-response/dashboard" },
        { name: "List", href: "/ops-response/list" },
        { name: "PIFTAC Reports", href: "/ops-response/piftac-reports" },
        { name: "Proscribed Terrorist Organization", href: "/ops-response/proscribed-terrorist-organization" },
        { name: "Coordination with LEAs", href: "/ops-response/coordination-leas" },
        { name: "Recovery", href: "/ops-response/recovery" },
        { name: "Reports", href: "/ops-response/reports" },
      ],
    },
    {
      name: "Intelligence cycle",
      href: "/intelligence-cycle/dashboard",
      icon: "🔍",
      children: [
        { name: "Dashboard", href: "/intelligence-cycle/dashboard" },
        { name: "List", href: "/intelligence-cycle/list" },
        { name: "Offices Established at PIFTAC", href: "/intelligence-cycle/offices-established-piftac" },
        { name: "Operational Facilities aval at PIFTAC", href: "/intelligence-cycle/operational-facilities-piftac" },
        { name: "Connectivity Status at PIFTAC and DCCs", href: "/intelligence-cycle/connectivity-status" },
        { name: "Allocation of IDs at PIFTAC", href: "/intelligence-cycle/allocation-ids-piftac" },
        { name: "PIFTAC Reports", href: "/intelligence-cycle/piftac-reports" },
        { name: "Predictive Analysis Detail", href: "/intelligence-cycle/predictive-analysis" },
        { name: "Source Reliability & Information Credibility Index", href: "/intelligence-cycle/source-reliability" },
      ],
    },
    {
      name: "Illegal Spectrum",
      href: "/illegal-spectrum/dashboard",
      icon: "⚖️",
      children: [
        { name: "Dashboard", href: "/illegal-spectrum/dashboard" },
        { name: "Extortion", href: "/illegal-spectrum/extortion" },
        { name: "Arms / Explosives and Illegal Urea transportation", href: "/illegal-spectrum/arms-explosives-urea" },
        { name: "Hawala/ Hundi", href: "/illegal-spectrum/hawala-hundi" },
        { name: "Black Market of Drones, NVDs etc", href: "/illegal-spectrum/black-market-drones" },
      ],
    },
    { name: "Users", href: "/users", icon: "👥" },
    // { name: "Departments", href: "/departments", icon: "🏢" },
    // { name: "Sections", href: "/sections", icon: "📁" },
    // { name: "Programs", href: "/programs", icon: "📚" },
    { name: "Roles", href: "/roles", icon: "🔐" },
  ], [totalUnreadCount]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const parentWithActiveChild = navigation.find((item) =>
      item.children?.some((child) => child && location.pathname.startsWith(child.href))
    );
    const nextOpen = parentWithActiveChild ? parentWithActiveChild.name : null;
    setOpenDropdown((prev) => (prev === nextOpen ? prev : nextOpen));
  }, [location.pathname, navigation]);

  return (
    <div className="relative w-64 md:w-64 sm:w-16 h-screen flex flex-col">
      {/* Futuristic Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-950"></div>
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-cyan-500/15 dark:from-purple-500/20 dark:via-transparent dark:to-cyan-500/20 animate-pulse"></div>
      
      {/* Glassmorphism Border Effect */}
      <div className="absolute inset-0 border-r border-slate-600/50 dark:border-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.15)] dark:shadow-[0_0_40px_rgba(147,51,234,0.3)]"></div>
      
      {/* Top Section - Scrollable Navigation */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="p-4">
        {/* Brand Section with Futuristic Styling */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-white via-purple-300 to-cyan-300 dark:from-purple-300 dark:via-purple-400 dark:to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
            DCC
          </h1>
          <p className="text-xs text-center mt-2 text-gray-200 dark:text-purple-200/80 font-light tracking-wide">
            District coordination comittee
          </p>
        </div>

        {/* Navigation with Futuristic Styling */}
          <nav className="space-y-2">
          {navigation.map((item) => {
            const childIsActive = item.children?.some(
              (child) => child && location.pathname === child.href
            );
            const isActive =
              location.pathname === item.href ||
              childIsActive ||
              (!!item.children && location.pathname.startsWith(item.href));
            const isOpen = openDropdown === item.name;

            return (
              <div key={item.name} className="space-y-1">
                <Link
                  to={item.href}
                  onClick={() => {
                    if (item.children) {
                      setOpenDropdown(item.name);
                    }
                  }}
                  className={`group relative flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/40 to-cyan-500/40 dark:from-purple-500/40 dark:to-cyan-500/40 text-white dark:text-purple-100 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/40 border border-purple-400/40 dark:border-purple-400/50"
                      : "text-gray-200 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-purple-500/10 hover:text-white dark:hover:text-purple-200 border border-transparent hover:border-purple-400/30 dark:hover:border-purple-400/30"
                  }`}
                >
                  {/* Active Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/25 to-cyan-400/25 dark:from-purple-400/30 dark:to-cyan-400/30 blur-sm -z-10"></div>
                  )}
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-400/15 group-hover:to-cyan-400/15 dark:group-hover:from-purple-400/15 dark:group-hover:to-cyan-400/15 transition-all duration-300 -z-10"></div>
                  
                  <span className="text-lg filter drop-shadow-sm">{item.icon}</span>
                  <span className="flex-1 font-medium">{item.name}</span>
                  
                  {/* {item.badge && item.badge > 0 && (
                    <span className="relative bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-semibold shadow-lg shadow-red-500/50 animate-pulse">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )} */}
                  
                  {item.children && (
                    <span className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </Link>

                  {/* Child Navigation with Futuristic Styling */}
                {item.children && isOpen && (
                  <div className="ml-6 space-y-1 pl-3 border-l-2 border-purple-400/30 dark:border-purple-400/30">
                    {item.children.map((child) => {
                      if (!child) return null;
                      const isChildActive = location.pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`group relative flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                            isChildActive
                              ? "bg-gradient-to-r from-purple-500/35 to-cyan-500/35 dark:from-purple-500/35 dark:to-cyan-500/35 text-white dark:text-purple-100 shadow-md shadow-purple-500/25 dark:shadow-purple-500/30 border border-purple-400/40 dark:border-purple-400/40"
                              : "text-gray-300 dark:text-gray-500 hover:bg-white/10 dark:hover:bg-purple-500/10 hover:text-white dark:hover:text-purple-200 border border-transparent hover:border-purple-400/30 dark:hover:border-purple-400/30"
                          }`}
                        >
                          {isChildActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-r-full"></div>
                          )}
                          <span className="font-medium">{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        </div>
      </div>

      {/* Bottom Section - Fixed Position (Logout & User Info) */}
      <div className="relative z-10 flex-shrink-0 border-t border-purple-400/20 dark:border-purple-400/20">
        <div className="p-4 space-y-3">
          {/* Separator with Glow */}
          <div className="relative">
            <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent dark:via-purple-400/50"></div>
            <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent dark:via-cyan-400/50 blur-sm"></div>
          </div>
          
          {/* Logout Button with Futuristic Styling */}
          <Button
            onClick={logout}
            className="relative w-full bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 text-white flex items-center justify-center space-x-2 rounded-lg shadow-lg shadow-red-500/30 dark:shadow-red-500/50 border border-red-400/30 dark:border-red-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/40 dark:hover:shadow-red-500/60 hover:scale-[1.02] font-medium"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </Button>

          {/* User Info Card with Glassmorphism */}
          <div className="relative group">
            {/* Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 dark:from-purple-500/20 dark:to-cyan-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
            
            {/* Main Card */}
            <div className="relative flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-purple-400/20 shadow-lg">
              {user ? (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white dark:text-purple-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-300 dark:text-purple-200/70 truncate">
                    {user.email}
                  </p>
                </div>
              ) : (
                <div className="text-xs text-gray-300 dark:text-gray-500">Not signed in</div>
              )}
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className="relative text-gray-200 dark:text-gray-400 hover:text-white dark:hover:text-purple-200 rounded-lg hover:bg-white/15 dark:hover:bg-purple-500/20 transition-all duration-300 hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 drop-shadow-sm" />
                ) : (
                  <Moon className="h-4 w-4 drop-shadow-sm" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

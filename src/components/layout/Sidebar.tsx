import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, BarChart2, Sparkles,
  BookOpen, Activity, Settings, LogOut, ChevronLeft, ChevronRight,
  Zap,
} from 'lucide-react';
import { logout } from '../../api/auth';

const NAV = [
  { label: 'Dashboard',      to: '/',              icon: LayoutDashboard },
  { label: 'Users',          to: '/users',         icon: Users },
  { label: 'Coaches',        to: '/coaches',       icon: UserCheck },
  { label: 'Analytics',      to: '/analytics',     icon: BarChart2 },
  { label: 'AI Insights',    to: '/ai',            icon: Sparkles,   badge: 'AI' },
  { label: 'Content',        to: '/content',       icon: BookOpen },
  { label: 'Health Monitor', to: '/health',        icon: Activity },
  { label: 'Settings',       to: '/settings',      icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        relative flex flex-col bg-white border-r border-slate-100 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[220px]'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 pt-6 pb-5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <div className="font-bold text-slate-900 text-base tracking-tight">FIT-IN</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Admin · OS v4.2</div>
          </div>
        )}
      </div>

      {/* Workspace label */}
      {!collapsed && (
        <div className="px-4 mb-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Workspace</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto">
        {NAV.map(({ label, to, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && (
              <span className="flex-1 truncate">{label}</span>
            )}
            {!collapsed && badge && (
              <span className="text-[10px] font-semibold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* AI Engine Status */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">AI Engine</span>
          </div>
          <div className="text-xs text-slate-500">Healthy · 99.94% uptime</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">2.4M <span className="text-xs font-normal text-slate-500">queries today</span></div>
        </div>
      )}

      {/* User + Logout */}
      <div className={`border-t border-slate-100 p-3 flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          SL
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-700 truncate">Sara Lee</div>
            <div className="text-[10px] text-slate-400">Super Admin</div>
          </div>
        )}
        {!collapsed && (
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
            <LogOut size={14} />
          </button>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors shadow-sm z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}

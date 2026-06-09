import { useState } from 'react';
import { Search, Bell, Moon, Sun, Sparkles, Command } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [dark, setDark] = useState(false);

  return (
    <header className="h-[60px] flex items-center justify-between px-6 bg-white border-b border-slate-100 flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search users, content, AI logs…"
            className="pl-8 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl w-60 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition"
          />
          <div className="absolute right-2.5 flex items-center gap-0.5 text-slate-400">
            <Command size={10} />
            <span className="text-[10px] font-medium">K</span>
          </div>
        </div>

        {/* Ask Aurora AI */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all shadow-sm">
          <Sparkles size={13} />
          <span className="hidden sm:inline">Ask Aurora</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-white ring-offset-1">
          SL
        </div>
      </div>
    </header>
  );
}

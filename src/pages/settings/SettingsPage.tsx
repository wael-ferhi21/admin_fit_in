import { useState } from 'react';
import { Save, Bell, Shield, Palette, Globe, Key } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

type Tab = 'general' | 'notifications' | 'security' | 'appearance';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'general',       label: 'General',       icon: Globe   },
  { id: 'notifications', label: 'Notifications', icon: Bell    },
  { id: 'security',      label: 'Security',      icon: Shield  },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
];

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ newUser: true, aiAlert: true, coachActivity: false, weeklyReport: true });
  const [appearance, setAppearance] = useState({ compactMode: false, animations: true, showRealtime: true });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout title="Settings" subtitle="Configure platform and admin preferences">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="card p-2">
          <nav className="flex flex-col gap-0.5">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="xl:col-span-3 card flex flex-col gap-6">
          {tab === 'general' && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4">General Settings</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Platform Name</label>
                  <input className="input" defaultValue="FIT-IN" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">API Base URL</label>
                  <input className="input" defaultValue="http://localhost:5000/api" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Admin Version Tag</label>
                  <input className="input" defaultValue="OS v4.2" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Support Email</label>
                  <input className="input" type="email" defaultValue="admin@fit-in.app" />
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4">Notification Preferences</h3>
              <ToggleRow label="New User Registrations" desc="Alert when new consumer signs up" value={notifs.newUser} onChange={v => setNotifs(n => ({ ...n, newUser: v }))} />
              <ToggleRow label="AI Engine Alerts" desc="Alerts for AI recommendation failures or anomalies" value={notifs.aiAlert} onChange={v => setNotifs(n => ({ ...n, aiAlert: v }))} />
              <ToggleRow label="Coach Activity" desc="Notify when a coach updates their profile or adds clients" value={notifs.coachActivity} onChange={v => setNotifs(n => ({ ...n, coachActivity: v }))} />
              <ToggleRow label="Weekly Summary Report" desc="Receive a weekly performance report" value={notifs.weeklyReport} onChange={v => setNotifs(n => ({ ...n, weeklyReport: v }))} />
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4">Security</h3>
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                  <Key size={16} className="text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-700">JWT Secret</div>
                    <div className="text-xs text-slate-400 mt-0.5">Managed via backend environment variable <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-600">JWT_SECRET</code></div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Change Admin Password</label>
                  <input className="input mb-2" type="password" placeholder="Current password" />
                  <input className="input mb-2" type="password" placeholder="New password" />
                  <input className="input" type="password" placeholder="Confirm new password" />
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-sm font-semibold text-emerald-700">Session Management</div>
                  <div className="text-xs text-emerald-600 mt-1">JWT token stored in localStorage · expires based on server config</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4">Appearance</h3>
              <ToggleRow label="Compact Mode" desc="Reduce spacing for a denser layout" value={appearance.compactMode} onChange={v => setAppearance(a => ({ ...a, compactMode: v }))} />
              <ToggleRow label="Smooth Animations" desc="Enable Framer Motion transitions" value={appearance.animations} onChange={v => setAppearance(a => ({ ...a, animations: v }))} />
              <ToggleRow label="Real-time Activity Feed" desc="Auto-refresh live activity every 30s" value={appearance.showRealtime} onChange={v => setAppearance(a => ({ ...a, showRealtime: v }))} />
              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Accent Color</label>
                <div className="flex gap-2">
                  {['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#14b8a6'].map(c => (
                    <button key={c} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button onClick={handleSave} className="btn-primary">
              <Save size={14} />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

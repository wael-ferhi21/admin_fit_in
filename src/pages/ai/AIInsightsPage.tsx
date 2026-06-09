import { useEffect, useState } from 'react';
import { Sparkles, Dumbbell, Utensils, Leaf, Trash2, RefreshCw, Zap } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAllUsers } from '../../api/users';
import { getRecommendationsByUser, createRecommendation, deleteRecommendation } from '../../api/recommendations';
import type { User, Recommendation } from '../../types';

const TYPE_CONFIG = {
  meal:      { icon: Utensils,  label: 'Meal Plan',     color: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'badge-green'  },
  workout:   { icon: Dumbbell,  label: 'Workout',       color: 'text-blue-500',    bg: 'bg-blue-50',    badge: 'badge-blue'   },
  lifestyle: { icon: Leaf,      label: 'Lifestyle',     color: 'text-purple-500',  bg: 'bg-purple-50',  badge: 'badge-purple' },
};

export default function AIInsightsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers().then(data => {
      const consumers = data.filter(u => u.role === 'Consumer');
      setUsers(consumers);
    }).catch(() => null);
  }, []);

  const loadRecs = async (userId: string) => {
    if (!userId) return;
    setLoadingRecs(true);
    try {
      const data = await getRecommendationsByUser(userId);
      setRecs(data);
    } catch { setRecs([]); }
    finally { setLoadingRecs(false); }
  };

  const handleSelect = (uid: string) => {
    setSelectedUserId(uid);
    loadRecs(uid);
  };

  const handleGenerate = async (type: 'meal' | 'workout' | 'lifestyle') => {
    if (!selectedUserId) return;
    setGenerating(type);
    try {
      const rec = await createRecommendation(selectedUserId, type);
      setRecs(prev => [rec, ...prev]);
    } catch (e: any) {
      alert(e.message);
    } finally { setGenerating(null); }
  };

  const handleDelete = async (id: string) => {
    await deleteRecommendation(id);
    setRecs(prev => prev.filter(r => r._id !== id));
  };

  const selectedUser = users.find(u => u._id === selectedUserId);

  return (
    <DashboardLayout title="AI Insights" subtitle="AI-powered wellness recommendations engine">

      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Recommendations',  value: '—', icon: Sparkles, color: '#8b5cf6' },
          { label: 'Model Accuracy',          value: '94.2%', icon: Zap,      color: '#10b981' },
          { label: 'Avg. Engagement Rate',    value: '71.8%', icon: RefreshCw, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}18` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* User selector */}
        <div className="card flex flex-col gap-3">
          <div className="text-sm font-semibold text-slate-700">Select Consumer</div>
          <input
            className="input text-sm"
            placeholder="Filter by name…"
            onChange={e => {
              const q = e.target.value.toLowerCase();
              const filtered = users.filter(u => (u.fullName || u.email).toLowerCase().includes(q));
              if (filtered.length === 1) handleSelect(filtered[0]._id);
            }}
          />
          <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
            {users.map(u => (
              <button
                key={u._id}
                onClick={() => handleSelect(u._id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${selectedUserId === u._id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(u.fullName || u.email).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate">{u.fullName || u.email}</div>
                  {u.fullName && <div className="text-[11px] text-slate-400 truncate">{u.email}</div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {selectedUser ? (
            <>
              {/* Generate panel */}
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-violet-500" />
                  <span className="text-sm font-semibold text-slate-700">Generate for <span className="text-violet-600">{selectedUser.fullName || selectedUser.email}</span></span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(['meal', 'workout', 'lifestyle'] as const).map(t => {
                    const cfg = TYPE_CONFIG[t];
                    return (
                      <button
                        key={t}
                        onClick={() => handleGenerate(t)}
                        disabled={generating === t}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-slate-200 hover:border-slate-300 hover:shadow-sm ${generating === t ? 'opacity-60' : ''}`}
                      >
                        <cfg.icon size={14} className={cfg.color} />
                        {generating === t ? 'Generating…' : cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recs list */}
              {loadingRecs ? (
                <div className="card">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-24 mb-2" />
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recs.length === 0 ? (
                <div className="card text-center py-10 text-slate-400">
                  <Sparkles size={28} className="mx-auto mb-2 text-slate-300" />
                  No recommendations yet — generate one above
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recs.map(rec => {
                    const cfg = TYPE_CONFIG[rec.type];
                    return (
                      <div key={rec._id} className="card flex gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                          <cfg.icon size={16} className={cfg.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cfg.badge}>{cfg.label}</span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(rec.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{rec.content}</p>
                        </div>
                        <button onClick={() => handleDelete(rec._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="card flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Sparkles size={36} className="mb-3 text-slate-300" />
              <p className="text-sm">Select a consumer from the left to view and generate AI recommendations</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

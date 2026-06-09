import { useEffect, useState } from 'react';
import { Star, Users, Award, Search, Plus, X, Pencil } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAllCoaches, updateCoach } from '../../api/coaches';
import { getAllUsers, createCoach } from '../../api/users';
import type { Coach, User } from '../../types';

interface EnrichedCoach extends Coach {
  userInfo?: User;
}

const BLANK_FORM = {
  fullName: '', email: '', password: '',
  specializations: '', certifications: '', bio: '',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={13} className="fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
      <span className="text-xs text-slate-400">/ 5</span>
    </div>
  );
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<EnrichedCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [creating, setCreating] = useState(false);
  const [editingCoach, setEditingCoach] = useState<EnrichedCoach | null>(null);
  const [editCoachForm, setEditCoachForm] = useState({ specializations: '', certifications: '', bio: '' });

  const load = () => {
    setLoading(true);
    Promise.all([getAllCoaches(), getAllUsers()])
      .then(([coachData, users]) => {
        const enriched = coachData.map(c => ({
          ...c,
          userInfo: users.find(u => u._id === (typeof c.userId === 'string' ? c.userId : (c.userId as any)?._id)),
        }));
        setCoaches(enriched);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEditCoach = (coach: EnrichedCoach) => {
    setEditingCoach(coach);
    setEditCoachForm({
      specializations: coach.specializations.join(', '),
      certifications: coach.certifications.join(', '),
      bio: coach.bio || '',
    });
  };

  const handleUpdateCoach = async () => {
    if (!editingCoach) return;
    const userId = typeof editingCoach.userId === 'string' ? editingCoach.userId : (editingCoach.userId as any)?._id;
    try {
      const updated = await updateCoach(userId, {
        specializations: editCoachForm.specializations ? editCoachForm.specializations.split(',').map(s => s.trim()).filter(Boolean) : [],
        certifications: editCoachForm.certifications ? editCoachForm.certifications.split(',').map(s => s.trim()).filter(Boolean) : [],
        bio: editCoachForm.bio || undefined,
      });
      setCoaches(prev => prev.map(c => c._id === updated._id ? { ...updated, userInfo: c.userInfo } : c));
      setEditingCoach(null);
    } catch (e: any) { alert(e.message); }
  };

  const handleCreate = async () => {
    if (!form.fullName || !form.email || !form.password) {
      alert('Full name, email, and password are required.');
      return;
    }
    setCreating(true);
    try {
      await createCoach({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        specializations: form.specializations ? form.specializations.split(',').map(s => s.trim()).filter(Boolean) : [],
        certifications: form.certifications ? form.certifications.split(',').map(s => s.trim()).filter(Boolean) : [],
        bio: form.bio || undefined,
      });
      setShowCreate(false);
      setForm(BLANK_FORM);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreating(false);
    }
  };

  const filtered = coaches.filter(c => {
    const name = c.userInfo?.fullName || c.userInfo?.email || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout title="Coaches" subtitle="Platform coaches and their performance">
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-8" placeholder="Search coaches…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="text-sm text-slate-500">{filtered.length} coaches</span>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> Create Coach
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-48">
              <div className="h-4 bg-slate-100 rounded w-32 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-48 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">No coaches found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((coach) => (
            <div key={coach._id} className="card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {(coach.userInfo?.fullName || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{coach.userInfo?.fullName || 'Coach'}</div>
                    <div className="text-xs text-slate-400">{coach.userInfo?.email}</div>
                  </div>
                </div>
                <StarRating rating={coach.rating} />
              </div>

              {coach.bio && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{coach.bio}</p>
              )}

              {coach.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {coach.specializations.slice(0, 3).map(s => (
                    <span key={s} className="badge-blue">{s}</span>
                  ))}
                  {coach.specializations.length > 3 && (
                    <span className="badge-slate">+{coach.specializations.length - 3}</span>
                  )}
                </div>
              )}

              {coach.certifications.length > 0 && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Award size={12} className="text-amber-500" />
                  <span className="text-xs text-slate-500">{coach.certifications.slice(0, 2).join(', ')}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users size={13} />
                  <span><strong className="text-slate-700">{coach.clients.length}</strong> clients</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Star size={13} className="text-slate-300" />
                  <span><strong className="text-slate-700">{coach.reviews.length}</strong> reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={coach.userInfo?.isActive ? 'badge-green' : 'badge-red'}>
                    {coach.userInfo?.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => openEditCoach(coach)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors" title="Edit"><Pencil size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Coach Modal */}
      {editingCoach && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Edit Coach — {editingCoach.userInfo?.fullName || 'Coach'}</h2>
              <button onClick={() => setEditingCoach(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input className="input" placeholder="Specializations (comma-separated)" value={editCoachForm.specializations} onChange={e => setEditCoachForm(f => ({ ...f, specializations: e.target.value }))} />
              <input className="input" placeholder="Certifications (comma-separated)" value={editCoachForm.certifications} onChange={e => setEditCoachForm(f => ({ ...f, certifications: e.target.value }))} />
              <textarea className="input resize-none" rows={3} placeholder="Bio (optional)" value={editCoachForm.bio} onChange={e => setEditCoachForm(f => ({ ...f, bio: e.target.value }))} />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button className="btn-ghost" onClick={() => setEditingCoach(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateCoach}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Create Coach</h2>
              <button onClick={() => { setShowCreate(false); setForm(BLANK_FORM); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <input className="input" placeholder="Full name *" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              <input className="input" placeholder="Email *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <input className="input" placeholder="Password *" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <input className="input" placeholder="Specializations (comma-separated)" value={form.specializations} onChange={e => setForm(f => ({ ...f, specializations: e.target.value }))} />
              <input className="input" placeholder="Certifications (comma-separated)" value={form.certifications} onChange={e => setForm(f => ({ ...f, certifications: e.target.value }))} />
              <textarea className="input resize-none" rows={3} placeholder="Bio (optional)" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button className="btn-ghost" onClick={() => { setShowCreate(false); setForm(BLANK_FORM); }}>Cancel</button>
              <button className="btn-primary" onClick={handleCreate} disabled={creating}>
                {creating ? 'Creating…' : 'Create Coach'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

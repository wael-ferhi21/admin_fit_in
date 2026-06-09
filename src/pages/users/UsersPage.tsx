import { useEffect, useState } from 'react';
import { Search, UserPlus, Trash2, Eye, Shield, ShieldOff, Pencil, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAllUsers, deleteUser, updateUser, createAdmin } from '../../api/users';
import type { User } from '../../types';

function RoleBadge({ role }: { role: User['role'] }) {
  const map = {
    Admin:    'badge-purple',
    Coach:    'badge-blue',
    Consumer: 'badge-green',
  } as const;
  return <span className={map[role]}>{role}</span>;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [creating, setCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserForm, setEditUserForm] = useState({ fullName: '', email: '' });
  const PER_PAGE = 12;

  useEffect(() => {
    getAllUsers()
      .then(data => { setUsers(data); setFiltered(data); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = users;
    if (search) list = list.filter(u => u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== 'All') list = list.filter(u => u.role === roleFilter);
    setFiltered(list);
    setPage(1);
  }, [search, roleFilter, users]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserForm({ fullName: user.fullName || '', email: user.email });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const updated = await updateUser(editingUser._id, { fullName: editUserForm.fullName, email: editUserForm.email });
      setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
      setEditingUser(null);
    } catch (e: any) { alert(e.message); }
  };

  const handleToggleActive = async (user: User) => {
    const updated = await updateUser(user._id, { isActive: !user.isActive });
    setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
  };

  const handleCreateAdmin = async () => {
    setCreating(true);
    try {
      await createAdmin(form);
      setShowCreate(false);
      setForm({ email: '', password: '', fullName: '' });
      const fresh = await getAllUsers();
      setUsers(fresh);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout title="Users" subtitle="Manage all platform accounts">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-8"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {['All', 'Consumer', 'Coach', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${roleFilter === r ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary ml-auto">
          <UserPlus size={14} /> Add Admin
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['User', 'Role', 'Status', 'Phone', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">No users found</td></tr>
            ) : paginated.map(user => (
              <tr key={user._id} className="border-b border-slate-50 table-row-hover">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(user.fullName || user.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{user.fullName || '—'}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5"><RoleBadge role={user.role} /></td>
                <td className="px-5 py-3.5"><StatusDot active={user.isActive} /></td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{user.phoneNumber || '—'}</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" title="View"><Eye size={14} /></button>
                    <button onClick={() => openEditUser(user)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" title="Edit"><Pencil size={14} /></button>
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'hover:bg-amber-50 text-slate-400 hover:text-amber-600' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'}`}
                      title={user.isActive ? 'Suspend' : 'Activate'}
                    >
                      {user.isActive ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">{filtered.length} total users</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, page - 3), Math.min(totalPages, page + 2)
              ).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Edit User</h2>
              <button onClick={() => setEditingUser(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input className="input" placeholder="Full Name" value={editUserForm.fullName} onChange={e => setEditUserForm(f => ({ ...f, fullName: e.target.value }))} />
              <input className="input" placeholder="Email" type="email" value={editUserForm.email} onChange={e => setEditUserForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button className="btn-ghost" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateUser}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Create Admin Account</h2>
            <div className="flex flex-col gap-3">
              <input className="input" placeholder="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              <input className="input" placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <input className="input" placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateAdmin} disabled={creating}>
                {creating ? 'Creating…' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

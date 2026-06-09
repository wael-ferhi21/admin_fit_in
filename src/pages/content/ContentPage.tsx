import { useEffect, useState } from 'react';
import { Dumbbell, Utensils, PlayCircle, Plus, Trash2, Search, Pencil, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  getAllExercises, createExercise, updateExercise, deleteExercise,
  getAllWorkouts, updateWorkout,
} from '../../api/workouts';
import {
  getAllMeals, createMeal, updateMeal, deleteMeal,
  getAllMealPlans, updateMealPlan,
} from '../../api/mealPlans';
import type { Exercise, WorkoutSession, Meal, MealPlan } from '../../types';

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms',
  'Core', 'Glutes', 'Quadriceps', 'Hamstrings', 'Calves', 'Full Body', 'Cardio',
];

type Tab = 'exercises' | 'workouts' | 'meals' | 'mealplans';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'exercises', label: 'Exercises', icon: Dumbbell },
  { id: 'workouts',  label: 'Workouts',  icon: PlayCircle },
  { id: 'meals',     label: 'Meals',     icon: Utensils },
  { id: 'mealplans', label: 'Meal Plans', icon: Utensils },
];

const INTENSITY_BADGE: Record<string, string> = {
  low:    'badge-green',
  medium: 'badge-amber',
  high:   'badge-red',
};

const BLANK_EX   = { name: '', muscleGroup: '', sets: '3', reps: '12', restTime: '60', videoUrl: '' };
const BLANK_MEAL = { name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '', prepTime: '', mealType: 'breakfast' as Meal['mealType'], description: '', image: '' };

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>('exercises');
  const [exercises,  setExercises]  = useState<Exercise[]>([]);
  const [workouts,   setWorkouts]   = useState<WorkoutSession[]>([]);
  const [meals,      setMeals]      = useState<Meal[]>([]);
  const [mealPlans,  setMealPlans]  = useState<MealPlan[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');

  // Create modals
  const [showForm, setShowForm] = useState(false);
  const [exForm,   setExForm]   = useState(BLANK_EX);
  const [mealForm, setMealForm] = useState(BLANK_MEAL);

  // Edit modals
  const [editingEx,       setEditingEx]       = useState<Exercise | null>(null);
  const [editExForm,      setEditExForm]      = useState(BLANK_EX);
  const [editingWorkout,  setEditingWorkout]  = useState<WorkoutSession | null>(null);
  const [editWorkoutForm, setEditWorkoutForm] = useState({ name: '', description: '', intensity: 'medium' as WorkoutSession['intensity'] });
  const [editingMeal,     setEditingMeal]     = useState<Meal | null>(null);
  const [editMealForm,    setEditMealForm]    = useState(BLANK_MEAL);
  const [editingPlan,     setEditingPlan]     = useState<MealPlan | null>(null);
  const [editPlanForm,    setEditPlanForm]    = useState({ name: '', dailyCalories: '', protein: '', carbs: '', fat: '', startDate: '', endDate: '' });

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllExercises(), getAllWorkouts(), getAllMeals(), getAllMealPlans()])
      .then(([ex, wo, me, mp]) => { setExercises(ex); setWorkouts(wo); setMeals(me); setMealPlans(mp); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  // ── Create handlers ────────────────────────────────────────────────────────
  const handleCreateExercise = async () => {
    try {
      const ex = await createExercise({
        name: exForm.name, muscleGroup: exForm.muscleGroup,
        sets: +exForm.sets, reps: +exForm.reps, restTime: +exForm.restTime,
        ...(exForm.videoUrl.trim() && { videoUrl: exForm.videoUrl.trim() }),
      });
      setExercises(prev => [ex, ...prev]);
      setShowForm(false);
      setExForm(BLANK_EX);
    } catch (e: any) { alert(e.message); }
  };

  const handleCreateMeal = async () => {
    try {
      const meal = await createMeal({
        name: mealForm.name, calories: +mealForm.calories,
        protein: +mealForm.protein, carbs: +mealForm.carbs, fat: +mealForm.fat,
        ...(mealForm.fiber     && { fiber:       +mealForm.fiber }),
        ...(mealForm.prepTime  && { prepTime:    +mealForm.prepTime }),
        ...(mealForm.description.trim() && { description: mealForm.description.trim() }),
        ...(mealForm.image.trim()       && { image:       mealForm.image.trim() }),
        mealType: mealForm.mealType,
      });
      setMeals(prev => [meal, ...prev]);
      setShowForm(false);
      setMealForm(BLANK_MEAL);
    } catch (e: any) { alert(e.message); }
  };

  // ── Edit openers ───────────────────────────────────────────────────────────
  const openEditEx = (ex: Exercise) => {
    setEditingEx(ex);
    setEditExForm({ name: ex.name, muscleGroup: ex.muscleGroup, sets: String(ex.sets), reps: String(ex.reps), restTime: String(ex.restTime), videoUrl: ex.videoUrl || '' });
  };

  const openEditWorkout = (w: WorkoutSession) => {
    setEditingWorkout(w);
    setEditWorkoutForm({ name: w.name, description: w.description || '', intensity: w.intensity });
  };

  const openEditMeal = (m: Meal) => {
    setEditingMeal(m);
    setEditMealForm({
      name: m.name, calories: String(m.calories),
      protein: String(m.protein), carbs: String(m.carbs), fat: String(m.fat),
      fiber: m.fiber != null ? String(m.fiber) : '',
      prepTime: m.prepTime != null ? String(m.prepTime) : '',
      mealType: m.mealType,
      description: m.description || '',
      image: m.image || '',
    });
  };

  const openEditPlan = (p: MealPlan) => {
    setEditingPlan(p);
    setEditPlanForm({
      name: p.name, dailyCalories: String(p.dailyCalories),
      protein: String(p.macros.protein), carbs: String(p.macros.carbs), fat: String(p.macros.fat),
      startDate: p.startDate.substring(0, 10), endDate: p.endDate.substring(0, 10),
    });
  };

  // ── Update handlers ────────────────────────────────────────────────────────
  const handleUpdateEx = async () => {
    if (!editingEx) return;
    try {
      const updated = await updateExercise(editingEx._id, {
        name: editExForm.name, muscleGroup: editExForm.muscleGroup,
        sets: +editExForm.sets, reps: +editExForm.reps, restTime: +editExForm.restTime,
        videoUrl: editExForm.videoUrl.trim() || undefined,
      });
      setExercises(prev => prev.map(e => e._id === updated._id ? updated : e));
      setEditingEx(null);
    } catch (e: any) { alert(e.message); }
  };

  const handleUpdateWorkout = async () => {
    if (!editingWorkout) return;
    try {
      const updated = await updateWorkout(editingWorkout._id, {
        name: editWorkoutForm.name,
        description: editWorkoutForm.description || undefined,
        intensity: editWorkoutForm.intensity,
      });
      setWorkouts(prev => prev.map(w => w._id === updated._id ? updated : w));
      setEditingWorkout(null);
    } catch (e: any) { alert(e.message); }
  };

  const handleUpdateMeal = async () => {
    if (!editingMeal) return;
    try {
      const updated = await updateMeal(editingMeal._id, {
        name: editMealForm.name, calories: +editMealForm.calories,
        protein: +editMealForm.protein, carbs: +editMealForm.carbs, fat: +editMealForm.fat,
        ...(editMealForm.fiber    && { fiber:    +editMealForm.fiber }),
        ...(editMealForm.prepTime && { prepTime: +editMealForm.prepTime }),
        description: editMealForm.description.trim() || undefined,
        image:       editMealForm.image.trim()       || undefined,
        mealType: editMealForm.mealType,
      });
      setMeals(prev => prev.map(m => m._id === updated._id ? updated : m));
      setEditingMeal(null);
    } catch (e: any) { alert(e.message); }
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    try {
      const updated = await updateMealPlan(editingPlan._id, {
        name: editPlanForm.name,
        dailyCalories: +editPlanForm.dailyCalories,
        macros: { protein: +editPlanForm.protein, carbs: +editPlanForm.carbs, fat: +editPlanForm.fat },
        startDate: editPlanForm.startDate,
        endDate: editPlanForm.endDate,
      });
      setMealPlans(prev => prev.map(p => p._id === updated._id ? updated : p));
      setEditingPlan(null);
    } catch (e: any) { alert(e.message); }
  };

  const filteredEx      = exercises.filter(e  => e.name.toLowerCase().includes(search.toLowerCase()) || e.muscleGroup.toLowerCase().includes(search.toLowerCase()));
  const filteredMeals   = meals.filter(m      => m.name.toLowerCase().includes(search.toLowerCase()));
  const filteredWorkouts = workouts.filter(w  => w.name.toLowerCase().includes(search.toLowerCase()));
  const filteredPlans   = mealPlans.filter(p  => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="Content" subtitle="Manage exercises, workouts, and nutrition content">
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 mb-5 w-fit shadow-card">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-8" placeholder={`Search ${tab}…`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {(tab === 'exercises' || tab === 'meals') && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={14} /> Add {tab === 'exercises' ? 'Exercise' : 'Meal'}
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card animate-pulse h-32" />)}
        </div>
      ) : tab === 'exercises' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEx.map(ex => (
            <div key={ex._id} className="card-hover flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{ex.name}</div>
                  <span className="badge-blue mt-1">{ex.muscleGroup}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditEx(ex)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => { deleteExercise(ex._id); setExercises(p => p.filter(e => e._id !== ex._id)); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="flex gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span><strong className="text-slate-700">{ex.sets}</strong> sets</span>
                <span><strong className="text-slate-700">{ex.reps}</strong> reps</span>
                <span><strong className="text-slate-700">{ex.restTime}s</strong> rest</span>
              </div>
              {ex.videoUrl && (
                <a href={ex.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                  <PlayCircle size={12} /> Video demo
                </a>
              )}
            </div>
          ))}
        </div>
      ) : tab === 'workouts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredWorkouts.map(w => (
            <div key={w._id} className="card-hover">
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-slate-800">{w.name}</div>
                <div className="flex items-center gap-1">
                  <span className={INTENSITY_BADGE[w.intensity]}>{w.intensity}</span>
                  <button onClick={() => openEditWorkout(w)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors"><Pencil size={13} /></button>
                </div>
              </div>
              {w.description && <p className="text-xs text-slate-500 mb-2 line-clamp-2">{w.description}</p>}
              <div className="flex gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span><strong className="text-slate-700">{(w.exercises as string[]).length}</strong> exercises</span>
                <span><strong className="text-slate-700">{w.consumerIds.length}</strong> consumers</span>
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'meals' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMeals.map(m => (
            <div key={m._id} className="card-hover flex flex-col gap-2 overflow-hidden">
              {m.image && (
                <img src={m.image} alt={m.name} className="w-full h-36 object-cover rounded-xl -mx-0" />
              )}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{m.name}</div>
                  <span className="badge-amber mt-1 capitalize">{m.mealType}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditMeal(m)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => { deleteMeal(m._id); setMeals(p => p.filter(x => x._id !== m._id)); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              {m.description && (
                <p className="text-xs text-slate-500 line-clamp-2">{m.description}</p>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span><strong className="text-amber-600">{m.calories}</strong> kcal</span>
                <span><strong className="text-blue-600">{m.protein}g</strong> protein</span>
                <span><strong className="text-emerald-600">{m.carbs}g</strong> carbs</span>
                <span><strong className="text-orange-500">{m.fat}g</strong> fat</span>
                {m.fiber != null && m.fiber > 0 && <span><strong className="text-violet-600">{m.fiber}g</strong> fiber</span>}
                {m.prepTime != null && m.prepTime > 0 && <span><strong className="text-slate-600">{m.prepTime}min</strong> prep</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPlans.map(p => (
            <div key={p._id} className="card-hover">
              <div className="flex items-start justify-between mb-1">
                <div className="font-semibold text-slate-800">{p.name}</div>
                <button onClick={() => openEditPlan(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-colors"><Pencil size={13} /></button>
              </div>
              <div className="text-xs text-slate-500 mb-2">{p.dailyCalories} kcal/day</div>
              <div className="flex gap-3 text-xs mb-2">
                <span className="badge-blue">{p.macros.protein}g protein</span>
                <span className="badge-green">{p.macros.carbs}g carbs</span>
                <span className="badge-amber">{p.macros.fat}g fat</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {new Date(p.startDate).toLocaleDateString()} → {new Date(p.endDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create: Exercise ───────────────────────────────────────────────── */}
      {showForm && tab === 'exercises' && (
        <Modal title="Add Exercise" onClose={() => { setShowForm(false); setExForm(BLANK_EX); }}>
          <input className="input" placeholder="Exercise name" value={exForm.name} onChange={e => setExForm(f => ({ ...f, name: e.target.value }))} />
          <select className="input" value={exForm.muscleGroup} onChange={e => setExForm(f => ({ ...f, muscleGroup: e.target.value }))}>
            <option value="">Select muscle group…</option>
            {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-2">
            <input className="input" placeholder="Sets" type="number" value={exForm.sets} onChange={e => setExForm(f => ({ ...f, sets: e.target.value }))} />
            <input className="input" placeholder="Reps" type="number" value={exForm.reps} onChange={e => setExForm(f => ({ ...f, reps: e.target.value }))} />
            <input className="input" placeholder="Rest (s)" type="number" value={exForm.restTime} onChange={e => setExForm(f => ({ ...f, restTime: e.target.value }))} />
          </div>
          <input className="input" placeholder="Video URL (Supabase — optional)" value={exForm.videoUrl} onChange={e => setExForm(f => ({ ...f, videoUrl: e.target.value }))} />
          <ModalActions onCancel={() => { setShowForm(false); setExForm(BLANK_EX); }} onConfirm={handleCreateExercise} label="Create" />
        </Modal>
      )}

      {/* ── Create: Meal ──────────────────────────────────────────────────── */}
      {showForm && tab === 'meals' && (
        <Modal title="Add Meal" onClose={() => { setShowForm(false); setMealForm(BLANK_MEAL); }}>
          <input className="input" placeholder="Meal name *" value={mealForm.name} onChange={e => setMealForm(f => ({ ...f, name: e.target.value }))} />
          <select className="input" value={mealForm.mealType} onChange={e => setMealForm(f => ({ ...f, mealType: e.target.value as Meal['mealType'] }))}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <textarea
            className="input resize-none"
            rows={5}
            placeholder="Description — recipe, ingredients, instructions…"
            value={mealForm.description}
            onChange={e => setMealForm(f => ({ ...f, description: e.target.value }))}
          />
          <p className="text-xs font-medium text-slate-500 -mb-1">Macros</p>
          <input className="input" placeholder="Calories *" type="number" value={mealForm.calories} onChange={e => setMealForm(f => ({ ...f, calories: e.target.value }))} />
          <div className="grid grid-cols-3 gap-2">
            <input className="input" placeholder="Protein (g) *" type="number" value={mealForm.protein} onChange={e => setMealForm(f => ({ ...f, protein: e.target.value }))} />
            <input className="input" placeholder="Carbs (g) *" type="number" value={mealForm.carbs} onChange={e => setMealForm(f => ({ ...f, carbs: e.target.value }))} />
            <input className="input" placeholder="Fat (g) *" type="number" value={mealForm.fat} onChange={e => setMealForm(f => ({ ...f, fat: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="Fiber (g)" type="number" value={mealForm.fiber} onChange={e => setMealForm(f => ({ ...f, fiber: e.target.value }))} />
            <input className="input" placeholder="Prep time (min)" type="number" value={mealForm.prepTime} onChange={e => setMealForm(f => ({ ...f, prepTime: e.target.value }))} />
          </div>
          <input className="input" placeholder="Image URL (Supabase — optional)" value={mealForm.image} onChange={e => setMealForm(f => ({ ...f, image: e.target.value }))} />
          <ModalActions onCancel={() => { setShowForm(false); setMealForm(BLANK_MEAL); }} onConfirm={handleCreateMeal} label="Create" />
        </Modal>
      )}

      {/* ── Edit: Exercise ────────────────────────────────────────────────── */}
      {editingEx && (
        <Modal title={`Edit — ${editingEx.name}`} onClose={() => setEditingEx(null)}>
          <input className="input" placeholder="Exercise name" value={editExForm.name} onChange={e => setEditExForm(f => ({ ...f, name: e.target.value }))} />
          <select className="input" value={editExForm.muscleGroup} onChange={e => setEditExForm(f => ({ ...f, muscleGroup: e.target.value }))}>
            <option value="">Select muscle group…</option>
            {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-2">
            <input className="input" placeholder="Sets" type="number" value={editExForm.sets} onChange={e => setEditExForm(f => ({ ...f, sets: e.target.value }))} />
            <input className="input" placeholder="Reps" type="number" value={editExForm.reps} onChange={e => setEditExForm(f => ({ ...f, reps: e.target.value }))} />
            <input className="input" placeholder="Rest (s)" type="number" value={editExForm.restTime} onChange={e => setEditExForm(f => ({ ...f, restTime: e.target.value }))} />
          </div>
          <input className="input" placeholder="Video URL (Supabase — optional)" value={editExForm.videoUrl} onChange={e => setEditExForm(f => ({ ...f, videoUrl: e.target.value }))} />
          <ModalActions onCancel={() => setEditingEx(null)} onConfirm={handleUpdateEx} label="Save" />
        </Modal>
      )}

      {/* ── Edit: Workout ─────────────────────────────────────────────────── */}
      {editingWorkout && (
        <Modal title={`Edit — ${editingWorkout.name}`} onClose={() => setEditingWorkout(null)}>
          <input className="input" placeholder="Workout name" value={editWorkoutForm.name} onChange={e => setEditWorkoutForm(f => ({ ...f, name: e.target.value }))} />
          <textarea className="input resize-none" rows={2} placeholder="Description (optional)" value={editWorkoutForm.description} onChange={e => setEditWorkoutForm(f => ({ ...f, description: e.target.value }))} />
          <select className="input" value={editWorkoutForm.intensity} onChange={e => setEditWorkoutForm(f => ({ ...f, intensity: e.target.value as WorkoutSession['intensity'] }))}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <ModalActions onCancel={() => setEditingWorkout(null)} onConfirm={handleUpdateWorkout} label="Save" />
        </Modal>
      )}

      {/* ── Edit: Meal ────────────────────────────────────────────────────── */}
      {editingMeal && (
        <Modal title={`Edit — ${editingMeal.name}`} onClose={() => setEditingMeal(null)}>
          <input className="input" placeholder="Meal name *" value={editMealForm.name} onChange={e => setEditMealForm(f => ({ ...f, name: e.target.value }))} />
          <select className="input" value={editMealForm.mealType} onChange={e => setEditMealForm(f => ({ ...f, mealType: e.target.value as Meal['mealType'] }))}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <textarea
            className="input resize-none"
            rows={5}
            placeholder="Description — recipe, ingredients, instructions…"
            value={editMealForm.description}
            onChange={e => setEditMealForm(f => ({ ...f, description: e.target.value }))}
          />
          <p className="text-xs font-medium text-slate-500 -mb-1">Macros</p>
          <input className="input" placeholder="Calories *" type="number" value={editMealForm.calories} onChange={e => setEditMealForm(f => ({ ...f, calories: e.target.value }))} />
          <div className="grid grid-cols-3 gap-2">
            <input className="input" placeholder="Protein (g) *" type="number" value={editMealForm.protein} onChange={e => setEditMealForm(f => ({ ...f, protein: e.target.value }))} />
            <input className="input" placeholder="Carbs (g) *" type="number" value={editMealForm.carbs} onChange={e => setEditMealForm(f => ({ ...f, carbs: e.target.value }))} />
            <input className="input" placeholder="Fat (g) *" type="number" value={editMealForm.fat} onChange={e => setEditMealForm(f => ({ ...f, fat: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="Fiber (g)" type="number" value={editMealForm.fiber} onChange={e => setEditMealForm(f => ({ ...f, fiber: e.target.value }))} />
            <input className="input" placeholder="Prep time (min)" type="number" value={editMealForm.prepTime} onChange={e => setEditMealForm(f => ({ ...f, prepTime: e.target.value }))} />
          </div>
          <input className="input" placeholder="Image URL (Supabase — optional)" value={editMealForm.image} onChange={e => setEditMealForm(f => ({ ...f, image: e.target.value }))} />
          <ModalActions onCancel={() => setEditingMeal(null)} onConfirm={handleUpdateMeal} label="Save" />
        </Modal>
      )}

      {/* ── Edit: Meal Plan ───────────────────────────────────────────────── */}
      {editingPlan && (
        <Modal title={`Edit — ${editingPlan.name}`} onClose={() => setEditingPlan(null)}>
          <input className="input" placeholder="Plan name" value={editPlanForm.name} onChange={e => setEditPlanForm(f => ({ ...f, name: e.target.value }))} />
          <input className="input" placeholder="Daily calories" type="number" value={editPlanForm.dailyCalories} onChange={e => setEditPlanForm(f => ({ ...f, dailyCalories: e.target.value }))} />
          <p className="text-xs text-slate-400 -mb-1">Macros</p>
          <div className="grid grid-cols-3 gap-2">
            <input className="input" placeholder="Protein (g)" type="number" value={editPlanForm.protein} onChange={e => setEditPlanForm(f => ({ ...f, protein: e.target.value }))} />
            <input className="input" placeholder="Carbs (g)" type="number" value={editPlanForm.carbs} onChange={e => setEditPlanForm(f => ({ ...f, carbs: e.target.value }))} />
            <input className="input" placeholder="Fat (g)" type="number" value={editPlanForm.fat} onChange={e => setEditPlanForm(f => ({ ...f, fat: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-slate-400 mb-1">Start date</p>
              <input className="input" type="date" value={editPlanForm.startDate} onChange={e => setEditPlanForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">End date</p>
              <input className="input" type="date" value={editPlanForm.endDate} onChange={e => setEditPlanForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <ModalActions onCancel={() => setEditingPlan(null)} onConfirm={handleUpdatePlan} label="Save" />
        </Modal>
      )}
    </DashboardLayout>
  );
}

// ── Shared modal primitives ────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onConfirm, label }: { onCancel: () => void; onConfirm: () => void; label: string }) {
  return (
    <div className="flex gap-2 mt-1 justify-end">
      <button className="btn-ghost" onClick={onCancel}>Cancel</button>
      <button className="btn-primary" onClick={onConfirm}>{label}</button>
    </div>
  );
}

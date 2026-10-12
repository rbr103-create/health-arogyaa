import React, { useState } from 'react';
import { HealthArogyaaLogo } from '../common/HealthArogyaaLogo';
import {
  FoodItem,
  MealCategory,
  DietType,
  GICategory,
  UserProfile,
  ExpertReviewRequest,
  ConsultationBooking,
  SubscriptionPayment,
  UpiPaymentSettings,
} from '../../types';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  RotateCcw,
  FileText,
  Calendar,
  Users,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  Home,
  UserPlus,
  BookOpen,
  CreditCard,
  QrCode,
  Copy,
  Save,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AdminPanelProps {
  allFoods: FoodItem[];
  allUsers: UserProfile[];
  activeUser: UserProfile;
  expertReviews: ExpertReviewRequest[];
  consultations: ConsultationBooking[];
  subscriptions?: SubscriptionPayment[];
  upiSettings?: UpiPaymentSettings;
  onAddFood: (food: FoodItem) => void;
  onUpdateFood: (food: FoodItem) => void;
  onDeleteFood: (foodId: string) => void;
  onResetFoods: () => void;
  onSwitchUser: (userId: string) => void;
  onUpdateReviewStatus: (
    id: string,
    status: ExpertReviewRequest['status'],
    feedback?: string
  ) => void;
  onUpdateConsultationStatus: (
    id: string,
    status: ConsultationBooking['status'],
    expertNotes?: string
  ) => void;
  onUpdateSubscriptionStatus?: (
    id: string,
    status: SubscriptionPayment['status'],
    adminNotes?: string
  ) => void;
  onSaveUpiSettings?: (settings: UpiPaymentSettings) => void;
  onGrantUserPremium?: (userId: string, months: number) => void;
  onExitAdmin: () => void;
  onOpenUserCalendar?: (user: UserProfile) => void;
  onOpenOnboarding?: () => void;
  adminTab?: 'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions';
  setAdminTab?: (tab: 'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  allFoods,
  allUsers,
  activeUser,
  expertReviews,
  consultations,
  subscriptions = [],
  upiSettings = {
    payeeVpa: 'healtharogyaa@upi',
    payeeName: 'HealthArogyaa Wellness',
    autoGrantProvisional: true,
  },
  onAddFood,
  onUpdateFood,
  onDeleteFood,
  onResetFoods,
  onSwitchUser,
  onUpdateReviewStatus,
  onUpdateConsultationStatus,
  onUpdateSubscriptionStatus,
  onSaveUpiSettings,
  onGrantUserPremium,
  onExitAdmin,
  onOpenUserCalendar,
  onOpenOnboarding,
  adminTab: propAdminTab,
  setAdminTab: propSetAdminTab,
}) => {
  const [internalTab, setInternalTab] = useState<'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions'>('foods');
  const activeTab = propAdminTab || internalTab;
  const setTab = propSetAdminTab || setInternalTab;

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Food Edit/Add Modal states
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Review inspecting modal state
  const [inspectingReview, setInspectingReview] = useState<ExpertReviewRequest | null>(null);
  const [reviewReplyText, setReviewReplyText] = useState('');

  // Consultation inspecting modal state
  const [inspectingConsultation, setInspectingConsultation] = useState<ConsultationBooking | null>(null);
  const [consultationNotesText, setConsultationNotesText] = useState('');

  // Subscriptions & UPI states
  const [upiVpaInput, setUpiVpaInput] = useState(upiSettings.payeeVpa);
  const [upiNameInput, setUpiNameInput] = useState(upiSettings.payeeName);
  const [upiAutoGrantInput, setUpiAutoGrantInput] = useState(upiSettings.autoGrantProvisional);
  const [upiSavedFeedback, setUpiSavedFeedback] = useState(false);
  const [subStatusFilter, setSubStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  const [grantUserId, setGrantUserId] = useState(allUsers[0]?.id || '');
  const [grantMonths, setGrantMonths] = useState<number>(1);
  const [grantSuccessMsg, setGrantSuccessMsg] = useState('');

  // Filter foods
  const filteredFoods = allFoods.filter(f => {
    const matchCat = categoryFilter === 'All' || f.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      f.name.toLowerCase().includes(q) ||
      (f.hindiName && f.hindiName.toLowerCase().includes(q)) ||
      f.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  const handleOpenAddFood = () => {
    setIsAddMode(true);
    setEditingFood({
      id: `FOOD-${Date.now()}`,
      name: '',
      hindiName: '',
      category: 'Breakfast',
      isCombo: true,
      vegetarian: true,
      dietType: 'Veg',
      serving: '1 standard serving',
      baseServingCount: 1,
      calories: 300,
      protein: 14,
      carbs: 45,
      fat: 8,
      fibre: 6,
      sugar: 2,
      gi: 'Low',
      gl: 9,
      tags: ['High Protein', 'Weight Loss Friendly'],
      active: true,
      notes: '',
    });
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood) return;

    if (isAddMode) {
      onAddFood(editingFood);
    } else {
      onUpdateFood(editingFood);
    }

    setEditingFood(null);
    setIsAddMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Admin Title Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center border border-amber-400/40">
            <HealthArogyaaLogo className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>HealthArogyaa Master Control</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-300">Live Database Edit Rights</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display">
              Admin Panel &amp; Nutrition Database Manager
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Edit food calories &amp; macros, review user food diaries, view 30-min consultation bookings, and switch test personas.
            </p>
          </div>
        </div>

        <button
          onClick={onExitAdmin}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition-colors self-start sm:self-center flex items-center gap-1.5"
          title="Return to User Home Dashboard"
        >
          <Home className="w-3.5 h-3.5 text-emerald-400" />
          <span>Home (User App)</span>
        </button>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setTab('foods')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'foods'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-700" />
          <span>Food Database ({allFoods.length} items)</span>
        </button>

        <button
          onClick={() => setTab('reviews')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          <span>Expert Reviews Queue ({expertReviews.length})</span>
          {expertReviews.some(r => r.status === 'Pending') && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setTab('consultations')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'consultations'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span>30-Min Consultations ({consultations.length})</span>
        </button>

        <button
          onClick={() => setTab('users')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'users'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-700" />
          <span>User Profiles &amp; Personas ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setTab('subscriptions')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'subscriptions'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-600" />
          <span>Subscriptions &amp; UPI ({subscriptions.length})</span>
          {subscriptions.some(s => s.status === 'Pending') && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setTab('methodology')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'methodology'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Clinical Standards &amp; Architecture</span>
        </button>
      </div>

      {/* ===================== TAB 1: FOOD DATABASE MANAGER (WITH EDIT RIGHTS) ===================== */}
      {activeTab === 'foods' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search database foods..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Categories</option>
                <option value="Breakfast">Breakfast</option>
                <option value="PreLunch">Pre-Lunch (Fruits &amp; Salads)</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Accompaniments">Accompaniments</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onResetFoods}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Reset database to initial 150+ verified catalog"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Seed Defaults</span>
              </button>

              <button
                onClick={handleOpenAddFood}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Food</span>
              </button>
            </div>
          </div>

          {/* Foods Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Food & Hindi Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Serving</th>
                  <th className="p-3 text-right">Calories</th>
                  <th className="p-3 text-right">Protein</th>
                  <th className="p-3 text-right">Carbs</th>
                  <th className="p-3 text-right">Fibre</th>
                  <th className="p-3 text-center">GI / GL</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Edit Rights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFoods.map(food => (
                  <tr key={food.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3 font-semibold text-stone-900">
                      <div>{food.name}</div>
                      {food.hindiName && (
                        <div className="text-[11px] text-stone-400 font-normal">
                          {food.hindiName}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-stone-600">
                      <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium">
                        {food.category}
                      </span>
                    </td>
                    <td className="p-3 text-stone-600 max-w-[150px] truncate">
                      {food.serving}
                    </td>
                    <td className="p-3 text-right font-bold text-stone-900 tabular-nums whitespace-nowrap">
                      {food.calories} kcal
                    </td>
                    <td className="p-3 text-right text-stone-700 tabular-nums">
                      {food.protein}g
                    </td>
                    <td className="p-3 text-right text-stone-700 tabular-nums">
                      {food.carbs}g
                    </td>
                    <td className="p-3 text-right text-stone-700 tabular-nums">
                      {food.fibre}g
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        food.gi === 'Low'
                          ? 'bg-emerald-50 text-emerald-700'
                          : food.gi === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {food.gi} ({food.gl})
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onUpdateFood({ ...food, active: !food.active })}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          food.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {food.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-1 shrink-0">
                      <button
                        onClick={() => {
                          setIsAddMode(false);
                          setEditingFood({ ...food });
                        }}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                        title="Edit Food Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteFood(food.id)}
                        className="p-1.5 bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-700 rounded-lg transition-colors"
                        title="Delete Food"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: EXPERT REVIEWS QUEUE ===================== */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 font-display">
              User Expert Review Submissions
            </h3>
            <span className="text-xs text-stone-500">
              Users who paid for written clinical dietitian assessment
            </span>
          </div>

          <div className="space-y-3">
            {expertReviews.map(r => (
              <div
                key={r.id}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{r.userName}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-xs font-semibold text-emerald-800">{r.reviewType}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-xs text-stone-500">{r.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-700">₹{r.amountPaid} Paid ✓</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-700">
                  <strong>User Request Notes:</strong> {r.userNotes}
                </p>

                {r.expertFeedback && (
                  <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs">
                    <strong className="text-emerald-800 block mb-1">Your Completed Clinical Observation:</strong>
                    <p className="text-stone-800">{r.expertFeedback}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setInspectingReview(r);
                      setReviewReplyText(r.expertFeedback || '');
                    }}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{r.status === 'Completed' ? 'Edit Clinical Review' : 'Write Expert Review'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: 30-MINUTE CONSULTATION BOOKINGS ===================== */}
      {activeTab === 'consultations' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 font-display">
              30-Minute Expert Consultation Bookings
            </h3>
            <span className="text-xs text-stone-500">
              One-on-one appointments with clinical dietitian
            </span>
          </div>

          <div className="space-y-3">
            {consultations.map(c => (
              <div
                key={c.id}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{c.userName}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {c.status}
                    </span>
                    <span className="text-xs text-stone-500">₹{c.amountPaid} Received ✓</span>
                  </div>
                  <div className="text-xs text-stone-600">
                    Slot: <strong>{c.date}</strong> at <strong>{c.timeSlot}</strong> (30 min)
                  </div>
                  <div className="text-xs text-stone-500">
                    Client: {c.userPhone || 'WhatsApp'} · Current: {c.currentWeightKg}kg · Target: {c.dailyTargetCalories} kcal
                  </div>
                  {c.expertNotes && (
                    <p className="text-xs text-stone-700 bg-white p-2 rounded border border-stone-200 mt-1">
                      <strong>Consultation Notes:</strong> {c.expertNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => {
                      setInspectingConsultation(c);
                      setConsultationNotesText(c.expertNotes || '');
                    }}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Add / View Notes
                  </button>

                  {c.status !== 'Completed' && (
                    <button
                      onClick={() => onUpdateConsultationStatus(c.id, 'Completed', c.expertNotes)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Done</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: USERS & SCENARIO TESTING ===================== */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                User Personas, Inductions & Adherence
              </h3>
              <p className="text-xs text-stone-500">
                Inspect 15-day calorie adherence calendars, verify recommendation criteria, or induct a new user.
              </p>
            </div>

            {onOpenOnboarding && (
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-center"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Induct New User</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allUsers.map(u => (
              <div
                key={u.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  activeUser.id === u.id
                    ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                    : 'border-stone-200 bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{u.name}</span>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">
                    {u.sex}, {u.age}y
                  </span>
                </div>

                <div className="space-y-1 text-xs text-stone-600">
                  <div>Weight: <strong>{u.weightKg} kg</strong> (Target {u.targetWeightKg} kg)</div>
                  <div>Diet: <strong>{u.dietPreference}</strong> ({u.likesRoti ? 'Likes Roti' : 'No Roti'}, {u.likesRice ? 'Rice' : 'No Rice'})</div>
                  {u.dislikes.length > 0 && (
                    <div className="text-amber-700">Dislikes: {u.dislikes.join(', ')}</div>
                  )}
                  {u.allergies && u.allergies.length > 0 && (
                    <div className="text-rose-700">Allergies: {u.allergies.join(', ')}</div>
                  )}
                  <div className="text-emerald-800 font-bold pt-1">
                    Calorie Target: {u.dailyCalories} kcal · Plan: {u.planLevel.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {onOpenUserCalendar && (
                    <button
                      type="button"
                      onClick={() => onOpenUserCalendar(u)}
                      className="w-full py-2 px-3 bg-white border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 text-stone-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>📅</span>
                      <span>Inspect 15-Day Calorie Calendar</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onSwitchUser(u.id);
                      onExitAdmin();
                    }}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                      activeUser.id === u.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    {activeUser.id === u.id ? 'Currently Active User' : 'Test App as this User'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 5: CLINICAL METHODOLOGY & ICMR STANDARDS ===================== */}
      {activeTab === 'methodology' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>HealthArogyaa Clinical Reference &amp; Scientific Methodology</span>
            </div>
            <h2 className="text-xl font-bold font-display text-stone-900">
              Why Our Methodology is the Centre — Not an AI Wrapper
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Dieticians and clinic administrators can review our deterministic nutrition pipeline, ICMR 2024 macronutrient ratios, and clinical calculation formulas.
            </p>
          </div>

          {/* Core Pipeline Diagram */}
          <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Deterministic Architecture Flow
            </span>
            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-semibold">
              <span className="px-3 py-1.5 bg-stone-800 rounded-xl border border-stone-700 text-amber-300">
                1. Clinical Methodology
              </span>
              <span className="text-stone-500">&rarr;</span>
              <span className="px-3 py-1.5 bg-stone-800 rounded-xl border border-stone-700 text-emerald-300">
                2. ICMR Food Database
              </span>
              <span className="text-stone-500">&rarr;</span>
              <span className="px-3 py-1.5 bg-stone-800 rounded-xl border border-stone-700 text-cyan-300">
                3. Deterministic Engine
              </span>
              <span className="text-stone-500">&rarr;</span>
              <span className="px-3 py-1.5 bg-stone-800 rounded-xl border border-stone-700 text-stone-100">
                4. Patient Autonomy
              </span>
              <span className="text-stone-500">&rarr;</span>
              <span className="px-3 py-1.5 bg-stone-800 rounded-xl border border-stone-700 text-purple-300">
                5. AI Vision (Assistive OCR Only)
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed pt-1">
              The core app is 100% independent of external LLM availability. If an AI provider changes pricing or suffers an outage, the nutrition engine, food database, calorie calculations, and client logs continue running seamlessly.
            </p>
          </div>

          {/* Grid of Clinical Standards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                ICMR-NIN 2024 Reference
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Calculations conform to Indian Council of Medical Research (ICMR) &amp; National Institute of Nutrition guidelines for reference sedentary/moderate Indian adults.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                Mifflin-St Jeor Clinical BMR
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                BMR = 10 &times; weight (kg) + 6.25 &times; height (cm) &minus; 5 &times; age + s (+5 for males, &minus;161 for females). Activity multipliers: 1.2 to 1.725.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Oil &amp; Ghee Variance (±10–15%)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Calibrated for Indian cooking styles where tadka, shallow frying, and ghee spread vary by 1–2 teaspoons (45–90 kcal impact per meal).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB: SUBSCRIPTIONS & UPI PAYMENTS ===================== */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          {/* Top Configuration Card: UPI ID & Payee Name */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Direct UPI Payment Gateway Configuration</span>
                </div>
                <h2 className="text-lg font-bold font-display text-stone-900">
                  Your UPI ID &amp; QR Code Setup
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Payments are received directly into your personal or GST bank account via Google Pay, PhonePe, Paytm, or BHIM with 0% platform fees.
                </p>
              </div>

              {upiSavedFeedback && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>UPI Settings Saved! ✓</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form to update UPI credentials */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Your Personal / Business UPI ID (VPA) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={upiVpaInput}
                      onChange={e => setUpiVpaInput(e.target.value.trim())}
                      placeholder="e.g. yourname@okaxis or 9876543210@paytm"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      This UPI ID is encoded into the QR code and mobile 1-tap links.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Payee Name (as registered with your Bank/GST) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={upiNameInput}
                      onChange={e => setUpiNameInput(e.target.value)}
                      placeholder="e.g. Ravinder Sharma / HealthArogyaa"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Displays to the user on Google Pay / PhonePe when scanning.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={upiAutoGrantInput}
                      onChange={e => setUpiAutoGrantInput(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Grant Instant 30-Day Provisional Access on UTR submission (Recommended)
                      </span>
                      <p className="text-[11px] text-stone-600">
                        When enabled, clients immediately get access to the Premium features upon entering their 12-digit UTR. You can cross-check your bank alert SMS later in this panel and revoke anytime if invalid.
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onSaveUpiSettings) {
                      onSaveUpiSettings({
                        payeeVpa: upiVpaInput,
                        payeeName: upiNameInput,
                        autoGrantProvisional: upiAutoGrantInput,
                      });
                    }
                    setUpiSavedFeedback(true);
                    setTimeout(() => setUpiSavedFeedback(false), 2500);
                  }}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Save UPI Settings &amp; Update QR</span>
                </button>
              </div>

              {/* Live QR Code Preview */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 flex flex-col items-center text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Live Client QR Preview
                </span>
                <div className="bg-white p-2.5 rounded-xl border border-stone-300 shadow-2xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(
                      `upi://pay?pa=${encodeURIComponent(upiVpaInput)}&pn=${encodeURIComponent(
                        upiNameInput
                      )}&am=199&cu=INR&tn=HealthArogyaa%20Premium`
                    )}`}
                    alt="Live UPI QR Preview"
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <div className="text-[11px] text-stone-600">
                  <p className="font-mono font-bold text-stone-900">{upiVpaInput}</p>
                  <p className="text-stone-500">{upiNameInput} · ₹199</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Payments Queue & UTR Verification */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Payment Receipts &amp; Bank UTR Reconciliation</span>
                </div>
                <h3 className="text-base font-bold font-display text-stone-900">
                  Subscription Payments &amp; 12-Digit UTRs ({subscriptions.length})
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Match the submitted 12-digit UTR number against your bank statement or credit SMS to confirm payment.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-center">
                <button
                  onClick={() => setSubStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    subStatusFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({subscriptions.length})
                </button>
                <button
                  onClick={() => setSubStatusFilter('Pending')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    subStatusFilter === 'Pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>Pending</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                    {subscriptions.filter(s => s.status === 'Pending').length}
                  </span>
                </button>
                <button
                  onClick={() => setSubStatusFilter('Approved')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    subStatusFilter === 'Approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Approved ({subscriptions.filter(s => s.status === 'Approved').length})
                </button>
                <button
                  onClick={() => setSubStatusFilter('Rejected')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    subStatusFilter === 'Rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Rejected ({subscriptions.filter(s => s.status === 'Rejected').length})
                </button>
              </div>
            </div>

            {/* Search Input for Subscriptions */}
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={subSearchQuery}
                onChange={e => setSubSearchQuery(e.target.value)}
                placeholder="Search by client name, phone, or 12-digit UTR..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Subscriptions Table */}
            {subscriptions.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
                No subscription payment requests received yet.
              </div>
            ) : (
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Client</th>
                      <th className="p-3">Date &amp; Time</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">12-Digit UTR Number</th>
                      <th className="p-3">Receipt</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {subscriptions
                      .filter(s => {
                        if (subStatusFilter !== 'all' && s.status !== subStatusFilter) return false;
                        if (subSearchQuery) {
                          const q = subSearchQuery.toLowerCase();
                          return (
                            s.userName.toLowerCase().includes(q) ||
                            (s.userPhone && s.userPhone.includes(q)) ||
                            s.upiTransactionId.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map(sub => (
                        <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-stone-900">{sub.userName}</div>
                            <div className="text-[11px] text-stone-500">
                              {sub.userPhone || sub.userEmail || `User ID: ${sub.userId}`}
                            </div>
                          </td>
                          <td className="p-3 text-stone-600 whitespace-nowrap">
                            {new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            <span className="text-[10px] text-stone-400 block">
                              {new Date(sub.submittedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-stone-900 whitespace-nowrap">
                            ₹{sub.amount}
                            <span className="text-[10px] text-stone-400 font-normal block">
                              {sub.planDurationMonths} Month
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 font-mono text-stone-900 font-bold bg-stone-100 px-2 py-1 rounded-lg border border-stone-200 inline-flex">
                              <span>{sub.upiTransactionId}</span>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(sub.upiTransactionId)}
                                className="text-stone-400 hover:text-stone-700 cursor-pointer"
                                title="Copy UTR"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="p-3">
                            {sub.screenshotUrl ? (
                              <button
                                type="button"
                                onClick={() => setViewingScreenshot(sub.screenshotUrl!)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Receipt</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-stone-400">None</span>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                sub.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : sub.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {sub.status !== 'Approved' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onUpdateSubscriptionStatus) {
                                      onUpdateSubscriptionStatus(sub.id, 'Approved', 'Verified by Admin');
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {sub.status !== 'Rejected' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onUpdateSubscriptionStatus) {
                                      onUpdateSubscriptionStatus(sub.id, 'Rejected', 'Invalid UTR or money not credited');
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Card: Direct Manual Premium Grant for VIPs / Offline Cash */}
          <div className="bg-stone-900 text-white rounded-2xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold font-display">
                Manual Premium Grant (VIP / Offline Cash / Complimentary)
              </h3>
            </div>
            <p className="text-xs text-stone-300">
              Directly activate or extend Premium Plan access for any client without requiring a UPI transaction.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <select
                value={grantUserId}
                onChange={e => setGrantUserId(e.target.value)}
                className="px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.planLevel === 'premium' ? 'Premium' : 'Free'})
                  </option>
                ))}
              </select>

              <select
                value={grantMonths}
                onChange={e => setGrantMonths(parseInt(e.target.value) || 1)}
                className="px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={1}>1 Month Access</option>
                <option value={3}>3 Months Access</option>
                <option value={6}>6 Months Access</option>
                <option value={12}>1 Year Access</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  if (onGrantUserPremium) {
                    onGrantUserPremium(grantUserId, grantMonths);
                    const targetUser = allUsers.find(u => u.id === grantUserId);
                    setGrantSuccessMsg(`Granted ${grantMonths} month(s) premium to ${targetUser?.name || 'User'}!`);
                    setTimeout(() => setGrantSuccessMsg(''), 3000);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Grant Access
              </button>

              {grantSuccessMsg && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {grantSuccessMsg}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal Lightbox */}
      {viewingScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 overflow-hidden space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-xs font-bold text-stone-900">Payment Screenshot Receipt</span>
              <button
                type="button"
                onClick={() => setViewingScreenshot(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto flex items-center justify-center bg-stone-100 rounded-xl p-2">
              <img
                src={viewingScreenshot}
                alt="Payment proof"
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: EDIT / ADD FOOD ===================== */}
      {editingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-base">
                {isAddMode ? 'Add New Food to Catalog' : `Edit Food: ${editingFood.name}`}
              </h3>
              <button
                onClick={() => setEditingFood(null)}
                className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 block mb-1">Food Name</label>
                  <input
                    type="text"
                    required
                    value={editingFood.name}
                    onChange={e => setEditingFood({ ...editingFood, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Hindi / Local Name</label>
                  <input
                    type="text"
                    value={editingFood.hindiName || ''}
                    onChange={e => setEditingFood({ ...editingFood, hindiName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={editingFood.category}
                    onChange={e => setEditingFood({ ...editingFood, category: e.target.value as MealCategory })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="PreLunch">Pre-Lunch (Fruits &amp; Salads)</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Accompaniments">Accompaniments</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Serving Description</label>
                  <input
                    type="text"
                    value={editingFood.serving}
                    onChange={e => setEditingFood({ ...editingFood, serving: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Diet Type</label>
                  <select
                    value={editingFood.dietType}
                    onChange={e =>
                      setEditingFood({
                        ...editingFood,
                        dietType: e.target.value as DietType,
                        vegetarian: e.target.value === 'Veg' || e.target.value === 'Vegan',
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Veg">Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Non-Veg">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={editingFood.calories}
                    onChange={e => setEditingFood({ ...editingFood, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingFood.protein}
                    onChange={e => setEditingFood({ ...editingFood, protein: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingFood.carbs}
                    onChange={e => setEditingFood({ ...editingFood, carbs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Fibre (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingFood.fibre}
                    onChange={e => setEditingFood({ ...editingFood, fibre: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Glycemic Index (GI)</label>
                  <select
                    value={editingFood.gi}
                    onChange={e => setEditingFood({ ...editingFood, gi: e.target.value as GICategory })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Glycemic Load (GL)</label>
                  <input
                    type="number"
                    value={editingFood.gl}
                    onChange={e => setEditingFood({ ...editingFood, gl: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Tags (comma-separated, e.g. Roti, Rice, High Protein, Low GI, No Paneer)
                </label>
                <input
                  type="text"
                  value={editingFood.tags.join(', ')}
                  onChange={e =>
                    setEditingFood({
                      ...editingFood,
                      tags: e.target.value
                        .split(',')
                        .map(t => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={editingFood.isCombo}
                    onChange={e => setEditingFood({ ...editingFood, isCombo: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Is Meal Combination (e.g. Dal + Roti + Sabzi)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={editingFood.active}
                    onChange={e => setEditingFood({ ...editingFood, active: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Active in App</span>
                </label>
              </div>

              <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingFood(null)}
                  className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: WRITE EXPERT REVIEW ===================== */}
      {inspectingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-base">
                Provide Clinical Dietitian Assessment
              </h3>
              <button
                onClick={() => setInspectingReview(null)}
                className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-900">{inspectingReview.userName}</div>
                <div className="text-stone-600">Review Focus: {inspectingReview.reviewType}</div>
                <div className="text-stone-700">Client Note: "{inspectingReview.userNotes}"</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800">
                    Your Personalized 2-Sentence Clinical Note:
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold">Tactic C: Human Connection</span>
                </div>

                {/* 1-Click Clinical Quick Templates */}
                <div className="mb-2 space-y-1">
                  <span className="text-[10px] text-stone-500 font-medium block">
                    Quick Clinical Presets (Click to insert):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setReviewReplyText(
                          `${inspectingReview.userName}, great job hitting your 75g protein goal. For next month, let's increase your fiber during pre-lunch to beat afternoon slumps.`
                        )
                      }
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-medium transition-colors text-left"
                    >
                      💡 75g Protein + Pre-Lunch Fiber Tip
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setReviewReplyText(
                          `${inspectingReview.userName}, excellent discipline keeping rotis to 2 per meal. Next month, focus on your 2.5L water & chaas intake to accelerate fat oxidation.`
                        )
                      }
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-medium transition-colors text-left"
                    >
                      💧 2-Roti Discipline + Hydration
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setReviewReplyText(
                          `${inspectingReview.userName}, strong consistency! Your dinner deficit was spot on. Let's swap 5 PM snacks to roasted makhana to eliminate evening sugar cravings.`
                        )
                      }
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-medium transition-colors text-left"
                    >
                      🍿 Dinner Deficit + Roasted Makhana Swap
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={reviewReplyText}
                  onChange={e => setReviewReplyText(e.target.value)}
                  placeholder="Write a clear, personalized 2-sentence note regarding their daily rotis, vegetable portions, protein timing, and hydration..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setInspectingReview(null)}
                  className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateReviewStatus(inspectingReview.id, 'Completed', reviewReplyText);
                    setInspectingReview(null);
                  }}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Transmit Review to User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: CONSULTATION NOTES ===================== */}
      {inspectingConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-base">
                Consultation Record: {inspectingConsultation.userName}
              </h3>
              <button
                onClick={() => setInspectingConsultation(null)}
                className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div>Client: <strong>{inspectingConsultation.userName}</strong></div>
                <div>Slot: {inspectingConsultation.date} at {inspectingConsultation.timeSlot}</div>
                <div>Goal: {inspectingConsultation.goal} · Calorie target: {inspectingConsultation.dailyTargetCalories} kcal</div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Consultation Call Notes:
                </label>
                <textarea
                  rows={4}
                  value={consultationNotesText}
                  onChange={e => setConsultationNotesText(e.target.value)}
                  placeholder="Record discussed health notes, agreed target deficit, and follow-up guidance..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setInspectingConsultation(null)}
                  className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateConsultationStatus(
                      inspectingConsultation.id,
                      inspectingConsultation.status,
                      consultationNotesText
                    );
                    setInspectingConsultation(null);
                  }}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Consultation Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

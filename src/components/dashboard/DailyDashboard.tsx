import React, { useState, useMemo } from 'react';
import { HealthArogyaaLogo } from '../common/HealthArogyaaLogo';
import {
  UserProfile,
  DailyLog,
  MealCategory,
  LoggedMealItem,
  FoodItem,
  WeightRecord,
  ExpertReviewRequest,
} from '../../types';
import { calculateBMI, formatHeight } from '../../utils/nutritionCalculators';
import {
  Plus,
  Trash2,
  ChevronRight,
  Flame,
  Droplets,
  Calendar,
  Sparkles,
  Info,
  Scale,
  Camera,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Award,
  Ruler,
  Lock,
  TrendingDown,
  TrendingUp,
  Activity,
  MessageSquare,
  Gift,
  Loader2,
  User,
  UserPlus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface DailyDashboardProps {
  userProfile: UserProfile;
  dailyLog: DailyLog;
  allFoods: FoodItem[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  weightRecords?: WeightRecord[];
  onOpenMealSelection: (category: MealCategory) => void;
  onRemoveMealItem: (slot: 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks', instanceId: string) => void;
  onUpdatePortion: (
    slot: 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks',
    instanceId: string,
    multiplier: number,
    baseFood: FoodItem
  ) => void;
  onOpenProfileModal: () => void;
  onOpenWeightModal: () => void;
  onOpenScannerModal: () => void;
  onOpenExpertModal: () => void;
  onUpdateWater: (delta: number) => void;
  onOpenCalendarModal?: () => void;
  onOpenPremiumModal?: () => void;
  onOpenMethodologyModal?: () => void;
  onOpenNutritionAccuracyModal?: () => void;
  onOpenDisclaimerModal?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenSeasonalDropsModal?: () => void;
  onSubmitMonthlyDieticianReview?: () => void;
  expertReviews?: ExpertReviewRequest[];
  onOpenOnboarding?: () => void;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  userProfile,
  dailyLog,
  allFoods,
  selectedDate,
  setSelectedDate,
  weightRecords = [],
  onOpenMealSelection,
  onRemoveMealItem,
  onUpdatePortion,
  onOpenProfileModal,
  onOpenWeightModal,
  onOpenScannerModal,
  onOpenExpertModal,
  onUpdateWater,
  onOpenCalendarModal,
  onOpenPremiumModal,
  onOpenMethodologyModal,
  onOpenNutritionAccuracyModal,
  onOpenDisclaimerModal,
  onOpenAdminLogin,
  onOpenSeasonalDropsModal,
  onSubmitMonthlyDieticianReview,
  expertReviews = [],
  onOpenOnboarding,
}) => {
  // Aggregate consumed calories & macros
  const allLoggedItems: LoggedMealItem[] = [
    ...dailyLog.breakfast,
    ...(dailyLog.preLunch || []),
    ...dailyLog.lunch,
    ...dailyLog.dinner,
    ...dailyLog.snacks,
  ];

  const totalCaloriesConsumed = allLoggedItems.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProteinConsumed = Math.round(allLoggedItems.reduce((acc, curr) => acc + curr.protein, 0) * 10) / 10;
  const totalCarbsConsumed = Math.round(allLoggedItems.reduce((acc, curr) => acc + curr.carbs, 0) * 10) / 10;
  const totalFatConsumed = Math.round(allLoggedItems.reduce((acc, curr) => acc + curr.fat, 0) * 10) / 10;
  const totalFibreConsumed = Math.round(allLoggedItems.reduce((acc, curr) => acc + curr.fibre, 0) * 10) / 10;

  const targetCalories = userProfile.dailyCalories;
  const caloriesRemaining = Math.max(0, targetCalories - totalCaloriesConsumed);
  const calorieProgressPercent = Math.min(100, Math.round((totalCaloriesConsumed / targetCalories) * 100));

  const currentBMI = calculateBMI(userProfile.weightKg, userProfile.heightCm);
  const heightInfo = formatHeight(userProfile.heightCm);

  // Date helpers
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  // 7-day weight trend calculation from weightRecords state
  const last7DaysWeightData = useMemo(() => {
    const days: {
      date: string;
      displayDay: string;
      displayDate: string;
      weight: number;
      target: number;
      isLogged: boolean;
    }[] = [];
    const today = new Date();

    const sortedRecords = [...(weightRecords || [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayDay = d.toLocaleDateString('en-US', { weekday: 'short' });
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const record = sortedRecords.find(r => r.date === dateStr);

      if (record) {
        days.push({
          date: dateStr,
          displayDay,
          displayDate,
          weight: Math.round(record.weightKg * 10) / 10,
          target: userProfile.targetWeightKg,
          isLogged: true,
        });
      } else {
        const priorRecords = sortedRecords.filter(r => r.date <= dateStr);
        const lastKnown = priorRecords.length > 0
          ? priorRecords[priorRecords.length - 1].weightKg
          : userProfile.weightKg;

        days.push({
          date: dateStr,
          displayDay,
          displayDate,
          weight: Math.round(lastKnown * 10) / 10,
          target: userProfile.targetWeightKg,
          isLogged: false,
        });
      }
    }

    return days;
  }, [weightRecords, userProfile.weightKg, userProfile.targetWeightKg]);

  const weightChange7Days = useMemo(() => {
    if (last7DaysWeightData.length < 2) return 0;
    const first = last7DaysWeightData[0].weight;
    const last = last7DaysWeightData[last7DaysWeightData.length - 1].weight;
    return Math.round((last - first) * 10) / 10;
  }, [last7DaysWeightData]);

  const minChartWeight = useMemo(() => {
    const vals = last7DaysWeightData.map(d => d.weight);
    return Math.floor(Math.min(...vals, userProfile.targetWeightKg) - 1);
  }, [last7DaysWeightData, userProfile.targetWeightKg]);

  const maxChartWeight = useMemo(() => {
    const vals = last7DaysWeightData.map(d => d.weight);
    return Math.ceil(Math.max(...vals, userProfile.targetWeightKg) + 1);
  }, [last7DaysWeightData, userProfile.targetWeightKg]);

  const mealSlots: {
    slotKey: 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks';
    category: MealCategory;
    title: string;
    subtitle?: string;
    items: LoggedMealItem[];
    recommendedBudgetKcal: number;
    recommendedFoodsSummary: string;
  }[] = [
    {
      slotKey: 'breakfast',
      category: 'Breakfast',
      title: 'Breakfast',
      items: dailyLog.breakfast,
      recommendedBudgetKcal: Math.round(targetCalories * 0.25),
      recommendedFoodsSummary: 'Besan Chilla · Moong Dal · Poha · Idli Sambar · Sprouts',
    },
    {
      slotKey: 'preLunch',
      category: 'PreLunch',
      title: 'Pre-Lunch (Fruit & Salad)',
      subtitle: 'Eat 15–30 min before lunch',
      items: dailyLog.preLunch || [],
      recommendedBudgetKcal: Math.round(targetCalories * 0.08),
      recommendedFoodsSummary: '1 bowl salad + 1–3 seasonal fruits (Orange · Mango · Grapes · Papaya · Guava · Kachumber · Sprouts)',
    },
    {
      slotKey: 'lunch',
      category: 'Lunch',
      title: 'Lunch',
      items: dailyLog.lunch,
      recommendedBudgetKcal: Math.round(targetCalories * 0.32),
      recommendedFoodsSummary: 'Dal + 2 Roti + Sabzi + Salad · Rajma Rice · Kadhi · Chicken Curry',
    },
    {
      slotKey: 'dinner',
      category: 'Dinner',
      title: 'Dinner',
      items: dailyLog.dinner,
      recommendedBudgetKcal: Math.round(targetCalories * 0.25),
      recommendedFoodsSummary: 'Moong Khichdi · Lauki Sabzi + Phulka · Egg Whites + Roti · Tofu',
    },
    {
      slotKey: 'snacks',
      category: 'Snacks',
      title: 'Snacks & Beverages',
      items: dailyLog.snacks,
      recommendedBudgetKcal: Math.round(targetCalories * 0.10),
      recommendedFoodsSummary: 'Roasted Makhana · Roasted Chana · Chaas · Sprout Bhel · Green Tea',
    },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Banner & Philosophy */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-white p-1 shadow-md shrink-0 border border-emerald-500/30 hidden xs:flex items-center justify-center">
              <HealthArogyaaLogo className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <span>HealthArogyaa Philosophy</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-400 font-normal">No rigid chart. You choose.</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                Know your food. Choose your meal. Build your day.
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                Hello, <span className="font-semibold text-white">{userProfile.name}</span>. Your target is{' '}
                <span className="font-bold text-emerald-400 tabular-nums">{targetCalories} kcal</span> for healthy, sustainable fat loss.
              </p>

              {/* Profile Quick Actions */}
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600/80 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Edit your personal age, height, weight, and targets"
                >
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>Edit Profile</span>
                </button>

                {onOpenOnboarding && (
                  <button
                    type="button"
                    onClick={onOpenOnboarding}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Create a new profile for yourself or another person"
                  >
                    <UserPlus className="w-3 h-3 text-emerald-300" />
                    <span>+ Make My Profile</span>
                  </button>
                )}
              </div>

              {/* Daily Wellness Tip for User */}
              <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-stone-300">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 rounded-lg font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Sustainable Nutrition
                </span>
                <span className="text-stone-300">
                  Balanced Indian portions · Choose any meal within your {targetCalories} kcal budget
                </span>
              </div>
            </div>
          </div>

          {/* Quick Date Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-center bg-stone-850 border border-stone-700/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                !isToday ? 'bg-stone-700 text-white font-medium' : 'text-stone-400 hover:text-white'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                isToday ? 'bg-emerald-600 text-white font-semibold shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* First Launch / New Member Induction Banner */}
        {(userProfile.id === 'client-user' || userProfile.name === 'New Member') && onOpenOnboarding && (
          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-950 to-stone-900 border-2 border-emerald-500/70 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                <UserPlus className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                    Welcome New Tester
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 text-[10px] rounded-full font-bold">
                    Profile Setup
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 font-display">
                  Make Your Personalized Health Profile
                </h3>
                <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                  Enter your name, age, height &amp; weight to calculate your personalized Indian calories and protein target.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Make My Profile</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Calorie Status Board */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Calorie Numbers */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Daily Calorie Balance
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-display tabular-nums">
                    {caloriesRemaining}
                  </span>
                  <span className="text-stone-500 text-xs sm:text-sm font-medium">kcal remaining</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-500 block">Daily Target</span>
                <span className="text-base sm:text-lg font-bold text-stone-700 tabular-nums">
                  {targetCalories} kcal
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Consumed: <strong className="text-stone-900 tabular-nums">{totalCaloriesConsumed} kcal</strong></span>
                <span className="tabular-nums font-medium">{calorieProgressPercent}% of budget</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalCaloriesConsumed > targetCalories
                      ? 'bg-rose-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, calorieProgressPercent)}%` }}
                />
              </div>
            </div>

            {/* Macro Breakdown - Tactic D: Graceful Downgrade locks advanced macro & timing */}
            {userProfile.planLevel === 'free' ? (
              <div className="pt-2 space-y-2.5">
                <div className="grid grid-cols-4 gap-2 text-center">
                  {/* Protein is unlocked on Free Plan for core basic tracking */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-800 font-bold">
                      <span>Protein</span>
                    </div>
                    <span className="text-sm font-bold text-stone-900 tabular-nums">
                      {totalProteinConsumed}g
                    </span>
                    <span className="block text-[10px] text-stone-500 mt-0.5 tabular-nums">
                      / {userProfile.proteinTargetGrams}g
                    </span>
                  </div>

                  {/* Carbs, Fats, Fibre - Gently locked on Free Tier */}
                  <div className="p-2.5 rounded-xl bg-stone-100/90 border border-stone-200 relative overflow-hidden group">
                    <div className="blur-xs select-none opacity-40">
                      <span className="block text-[11px] text-stone-500 font-medium">Carbs</span>
                      <span className="text-sm font-bold text-stone-900 tabular-nums">{totalCarbsConsumed}g</span>
                      <span className="block text-[10px] text-stone-400 mt-0.5">/ {userProfile.carbsTargetGrams}g</span>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100/95 text-[10px] font-bold text-stone-600">
                      <Lock className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                      <span>Pro Carbs</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-100/90 border border-stone-200 relative overflow-hidden group">
                    <div className="blur-xs select-none opacity-40">
                      <span className="block text-[11px] text-stone-500 font-medium">Fats</span>
                      <span className="text-sm font-bold text-stone-900 tabular-nums">{totalFatConsumed}g</span>
                      <span className="block text-[10px] text-stone-400 mt-0.5">/ {userProfile.fatTargetGrams}g</span>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100/95 text-[10px] font-bold text-stone-600">
                      <Lock className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                      <span>Pro Fats</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-100/90 border border-stone-200 relative overflow-hidden group">
                    <div className="blur-xs select-none opacity-40">
                      <span className="block text-[11px] text-stone-500 font-medium">Fibre</span>
                      <span className="text-sm font-bold text-stone-900 tabular-nums">{totalFibreConsumed}g</span>
                      <span className="block text-[10px] text-stone-400 mt-0.5">/ {userProfile.fibreTargetGrams}g</span>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100/95 text-[10px] font-bold text-stone-600">
                      <Lock className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                      <span>Pro Fibre</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between gap-2 text-[11px] text-amber-950">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>
                      Detailed macro breakdown &amp; adaptive deficit adjustments are paused on the Free Tier.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPremiumModal}
                    className="font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
                  >
                    Unlock Pro (from ₹150/mo) &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="block text-[11px] text-stone-500 font-medium">Protein</span>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {totalProteinConsumed}g
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-0.5 tabular-nums">
                    / {userProfile.proteinTargetGrams}g
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="block text-[11px] text-stone-500 font-medium">Carbs</span>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {totalCarbsConsumed}g
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-0.5 tabular-nums">
                    / {userProfile.carbsTargetGrams}g
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="block text-[11px] text-stone-500 font-medium">Fats</span>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {totalFatConsumed}g
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-0.5 tabular-nums">
                    / {userProfile.fatTargetGrams}g
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="block text-[11px] text-stone-500 font-medium">Fibre</span>
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {totalFibreConsumed}g
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-0.5 tabular-nums">
                    / {userProfile.fibreTargetGrams}g
                  </span>
                </div>
              </div>
            )}

            {/* Quick 15-Day Calorie Calendar & Nutrition Variance triggers */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onOpenCalendarModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 text-xs font-bold transition-colors shadow-2xs"
                title="View your 15-day adherence and calorie trend"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>15-Day Calorie Calendar</span>
              </button>

              <button
                type="button"
                onClick={onOpenNutritionAccuracyModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-colors"
                title="Learn why Indian cooking has ±10% to 15% variation"
              >
                <Info className="w-3.5 h-3.5 text-stone-500" />
                <span>Actual vs Approx Values (±10-15%)</span>
              </button>
            </div>
          </div>

          {/* Quick Action Box with Visible Height & Weight */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/90 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                Health Parameters
              </span>
              <div className="flex items-center gap-2">
                {onOpenOnboarding && (
                  <button
                    type="button"
                    onClick={onOpenOnboarding}
                    className="text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                    title="Create new profile / sign up"
                  >
                    + New Profile
                  </button>
                )}
                <span className="text-stone-300">|</span>
                <button
                  onClick={onOpenProfileModal}
                  className="text-stone-600 hover:text-stone-900 font-semibold text-xs"
                >
                  Edit / Switch
                </button>
              </div>
            </div>

            {/* Height & Weight Parameters Clearly Displayed Together */}
            <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                  Height:
                </span>
                <span className="font-bold text-stone-900">
                  {userProfile.heightCm} cm{' '}
                  <span className="text-stone-500 font-normal">({heightInfo.feetInches})</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  Weight:
                </span>
                <span className="font-bold text-stone-900 tabular-nums">
                  {userProfile.weightKg.toFixed(1)} kg{' '}
                  <span className="text-stone-400 font-normal text-[11px]">
                    (Goal {userProfile.targetWeightKg} kg)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-stone-100">
                <span className="text-stone-500">BMI Index:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-stone-900 tabular-nums">
                    {currentBMI.bmi}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${currentBMI.categoryColor} bg-stone-100`}>
                    {currentBMI.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Tier Status */}
            <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
              userProfile.planLevel === 'premium'
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold">
                  {userProfile.planLevel === 'premium' ? 'Premium (Active)' : 'Free Tier'}
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenPremiumModal}
                className="font-bold text-[11px] underline hover:opacity-80"
              >
                {userProfile.planLevel === 'premium' ? 'Perks' : 'Upgrade (₹199/mo)'}
              </button>
            </div>

            <div className="space-y-1 text-xs text-stone-700 px-1">
              <div className="flex justify-between">
                <span>Diet:</span>
                <span className="font-semibold text-stone-900">{userProfile.dietPreference}</span>
              </div>
              <div className="flex justify-between">
                <span>Grain:</span>
                <span className="font-semibold text-stone-900">
                  {userProfile.likesRoti ? 'Likes Roti' : 'No Roti'} · {userProfile.likesRice ? 'Rice' : 'No Rice'}
                </span>
              </div>
              {userProfile.dislikes.length > 0 && (
                <div className="flex justify-between">
                  <span>Avoids:</span>
                  <span className="font-semibold text-amber-700 capitalize">
                    {userProfile.dislikes.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-1 grid grid-cols-2 gap-2">
              <button
                onClick={onOpenScannerModal}
                className="w-full py-2 px-3 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scan Food</span>
              </button>

              <button
                onClick={onOpenWeightModal}
                className="w-full py-2 px-3 bg-white border border-stone-300 text-stone-800 rounded-lg text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                <span>Log Weight</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Weight Trend Line Chart (Recharts) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 font-display">
                  7-Day Weight Trend
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                  Last 7 Days
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Visualizing weigh-in trajectory toward goal ({userProfile.targetWeightKg} kg)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-base sm:text-lg font-extrabold text-stone-900 font-display tabular-nums">
                  {userProfile.weightKg.toFixed(1)} kg
                </span>
                {weightChange7Days < 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {Math.abs(weightChange7Days)} kg
                  </span>
                ) : weightChange7Days > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{weightChange7Days} kg
                  </span>
                ) : (
                  <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    Steady
                  </span>
                )}
              </div>
              <span className="text-[10px] text-stone-400 block">7-day change</span>
            </div>

            <button
              onClick={onOpenWeightModal}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Record new weigh-in"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-700" />
              <span>Log Weight</span>
            </button>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="w-full h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={last7DaysWeightData}
              margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="displayDay"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                domain={[minChartWeight, maxChartWeight]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                unit="kg"
              />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-stone-900 text-white text-xs rounded-xl p-3 shadow-xl border border-stone-700 min-w-[150px]">
                        <div className="font-semibold text-stone-300 text-[11px] mb-1 flex items-center justify-between">
                          <span>{data.displayDay}, {data.displayDate}</span>
                          {data.isLogged && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Weigh-in recorded" />
                          )}
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-stone-400">Weight:</span>
                          <span className="font-extrabold text-emerald-400 text-sm tabular-nums">
                            {data.weight} kg
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-3 mt-0.5 text-[11px]">
                          <span className="text-stone-400">Target:</span>
                          <span className="font-semibold text-stone-300 tabular-nums">
                            {data.target} kg
                          </span>
                        </div>
                        <div className="mt-1.5 pt-1 border-t border-stone-800 text-[10px] text-stone-400">
                          {data.isLogged ? '✓ Recorded weigh-in' : 'Tracked baseline'}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={userProfile.targetWeightKg}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: `Goal ${userProfile.targetWeightKg}kg`,
                  position: 'insideBottomRight',
                  fill: '#059669',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                name="Weight"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: '#059669',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: '#047857',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100 text-[11px] text-stone-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Recorded Weight
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b-2 border-dashed border-emerald-500 inline-block" />
              Target ({userProfile.targetWeightKg} kg)
            </span>
          </div>
          <span className="text-stone-400 hidden xs:inline">
            Starting: {userProfile.startingWeightKg} kg
          </span>
        </div>
      </div>

      {/* Tactic B: Seasonal & Festive Nutrition Intelligence Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-2xl p-4 sm:p-5 border border-amber-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="text-3xl sm:text-4xl shrink-0">🪔✨</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                Seasonal Drop · Festive 80/20 Buffering
              </span>
              {userProfile.planLevel === 'premium' ? (
                <span className="text-[10px] font-bold text-emerald-400">✓ Included in Plan</span>
              ) : (
                <span className="text-[10px] text-amber-200">Unlock with Transformation Plan</span>
              )}
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white mt-1 font-display">
              Festive Dining Without Fat Gain: The 80/20 Buffer Strategy
            </h3>
            <p className="text-xs text-stone-300 mt-0.5 max-w-xl">
              Pre-party lean protein anchors, portion-wise sweet satisfaction formulas, and digestion-reset herbal coolers.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSeasonalDropsModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-center"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore Seasonal Drops</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tactic C: Monthly Certified Dietician Audit Card */}
      {userProfile.planLevel === 'premium' ? (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
                🩺
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display">
                    Monthly Dietician Clinical Audit
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Included with Plan
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Certified Dietician (Ravi Sushil Bhargav) review of your 7-day meal consistency &amp; macro targets.
                </p>
              </div>
            </div>

            {expertReviews.some(
              r => r.userId === userProfile.id && (r.status === 'Pending' || r.status === 'Under Review')
            ) ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold self-start sm:self-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Under Review by Dietician</span>
              </span>
            ) : (
              <button
                onClick={onSubmitMonthlyDieticianReview}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-center shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Submit Log for Review ({userProfile.monthlyReviewTokensRemaining ?? 1} Token Available)
                </span>
              </button>
            )}
          </div>

          {/* If there is personalized feedback from Dietician */}
          {userProfile.lastDieticianFeedback && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <span>👩‍⚕️</span>
                  <span>Dietician Clinical Note ({userProfile.lastDieticianFeedback.dieticianName})</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-normal">
                  {userProfile.lastDieticianFeedback.date}
                </span>
              </div>
              <p className="text-stone-700 leading-relaxed italic">
                "{userProfile.lastDieticianFeedback.note}"
              </p>
              {userProfile.lastDieticianFeedback.actionSteps && userProfile.lastDieticianFeedback.actionSteps.length > 0 && (
                <div className="pt-1.5 border-t border-emerald-200/60">
                  <span className="font-bold text-[11px] text-emerald-900 block mb-1">
                    Your Action Steps This Month:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 text-[11px]">
                    {userProfile.lastDieticianFeedback.actionSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Free Tier: Graceful Downgrade State & Archived Clinical Care */
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-xs sm:text-sm">
                    Free Tier: Basic Indian Calorie Logging
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                    Graceful Downgrade
                  </span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  AI Food Scanner: <strong>{Math.max(0, 3 - (userProfile.freeScansUsed || 0))}/3</strong> trial scans remaining · Advanced macro bars &amp; monthly human dietician audits are paused.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPremiumModal}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-center"
            >
              Unlock 3-Month Plan (₹499)
            </button>
          </div>

          {/* Archived Dietician Note (Reminder of personal care they experienced) */}
          {userProfile.lastDieticianFeedback && (
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 text-xs text-stone-800 space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <span>👩‍⚕️</span>
                  <span>Previous Dietician Clinical Note ({userProfile.lastDieticianFeedback.dieticianName})</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  {userProfile.lastDieticianFeedback.date} · Saved in History
                </span>
              </div>
              <p className="text-stone-700 leading-relaxed italic bg-stone-50 p-2.5 rounded-lg border border-stone-150">
                "{userProfile.lastDieticianFeedback.note}"
              </p>
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <span className="text-amber-800 font-medium">
                  Renew your transformation plan to submit your log and receive this month's personalized audit.
                </span>
                <button
                  type="button"
                  onClick={onOpenPremiumModal}
                  className="font-bold text-emerald-700 hover:text-emerald-800 underline shrink-0 cursor-pointer text-left"
                >
                  Renew Plan for ₹199 &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4 Main Meal Action Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Today's Meals
          </h2>
          <span className="text-xs text-stone-500">
            Tap a meal to choose verified Indian choices
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mealSlots.map(slot => {
            const slotCalories = slot.items.reduce((acc, curr) => acc + curr.calories, 0);
            const slotProtein = Math.round(slot.items.reduce((acc, curr) => acc + (curr.protein || 0), 0) * 10) / 10;
            const slotFibre = Math.round(slot.items.reduce((acc, curr) => acc + (curr.fibre || 0), 0) * 10) / 10;
            const slotCarbs = Math.round(slot.items.reduce((acc, curr) => acc + (curr.carbs || 0), 0) * 10) / 10;

            const proteinTarget = userProfile.proteinTargetGrams || 75;
            const fibreTarget = userProfile.fibreTargetGrams || 30;
            const carbsTarget = userProfile.carbsTargetGrams || 180;

            const proteinPercent = Math.min(100, Math.round((slotProtein / proteinTarget) * 100));
            const fibrePercent = Math.min(100, Math.round((slotFibre / fibreTarget) * 100));
            const carbsPercent = Math.min(100, Math.round((slotCarbs / carbsTarget) * 100));

            return (
              <div
                key={slot.slotKey}
                className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Header row - Guaranteed zero overflow across mobile & desktop */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 font-bold text-sm shrink-0">
                        {slot.slotKey === 'breakfast' && '🌅'}
                        {slot.slotKey === 'preLunch' && '🥗'}
                        {slot.slotKey === 'lunch' && '🍛'}
                        {slot.slotKey === 'dinner' && '🌙'}
                        {slot.slotKey === 'snacks' && '🍵'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
                            {slot.title}
                          </h3>
                          {slot.subtitle && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                              {slot.subtitle}
                            </span>
                          )}
                          <span className="text-[11px] sm:text-xs text-stone-500 font-medium whitespace-nowrap">
                            (Target ~{slot.recommendedBudgetKcal} kcal)
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 truncate max-w-[200px] xs:max-w-xs sm:max-w-md">
                          {slot.recommendedFoodsSummary}
                        </p>
                      </div>
                    </div>

                    {/* Mobile only: Calories displayed inline in the slot title row, firmly inside the card */}
                    <div className="text-right sm:hidden shrink-0 pl-1.5">
                      <span className="text-sm font-extrabold text-stone-900 font-display tabular-nums">
                        {slotCalories}
                      </span>
                      <span className="text-[10px] text-stone-400 block font-normal leading-tight">kcal</span>
                    </div>
                  </div>

                  {/* Actions: Desktop shows calories + button; Mobile shows responsive full-width button */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 pt-0.5 sm:pt-0">
                    <div className="hidden sm:block text-right">
                      <span className="text-base font-bold text-stone-900 font-display tabular-nums">
                        {slotCalories}
                      </span>
                      <span className="text-[11px] text-stone-400 block font-normal leading-tight">kcal</span>
                    </div>

                    <button
                      onClick={() => onOpenMealSelection(slot.category)}
                      className="w-full sm:w-auto px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Choose Food</span>
                    </button>
                  </div>
                </div>

                {/* Small, Color-Coded Macro Progress Bars toward Daily Targets */}
                <div className="bg-stone-50/90 rounded-xl p-2.5 sm:p-3 border border-stone-200/60 my-2.5">
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-semibold text-stone-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Meal Progress Toward Daily Targets
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Targets: {proteinTarget}g P · {fibreTarget}g Fib · {carbsTarget}g C
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                    {/* Protein Progress Bar (Blue) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-blue-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                          Protein
                        </span>
                        <span className="font-bold text-stone-800 tabular-nums text-[11px]">
                          {slotProtein}g{' '}
                          <span className="text-[10px] text-stone-400 font-normal">
                            ({proteinPercent}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${proteinPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Fiber Progress Bar (Emerald) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          Fiber
                        </span>
                        <span className="font-bold text-stone-800 tabular-nums text-[11px]">
                          {slotFibre}g{' '}
                          <span className="text-[10px] text-stone-400 font-normal">
                            ({fibrePercent}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${fibrePercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Carbs Progress Bar (Amber) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-amber-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                          Carbs
                        </span>
                        <span className="font-bold text-stone-800 tabular-nums text-[11px]">
                          {slotCarbs}g{' '}
                          <span className="text-[10px] text-stone-400 font-normal">
                            ({carbsPercent}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${carbsPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logged items in this slot with Redesigned Responsive Layout */}
                {slot.items.length === 0 ? (
                  <div
                    onClick={() => onOpenMealSelection(slot.category)}
                    className="p-3.5 bg-stone-50/70 border border-dashed border-stone-200 rounded-xl text-center cursor-pointer hover:bg-stone-50 transition-colors"
                  >
                    <p className="text-xs text-stone-500">
                      No items selected yet. Tap <span className="font-semibold text-emerald-700">+ Choose Food</span> to build this meal.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {slot.items.map(item => {
                      const baseFood = allFoods.find(f => f.id === item.foodId);

                      return (
                        <div
                          key={item.instanceId}
                          className="p-3.5 bg-stone-50/90 rounded-xl border border-stone-200/80 hover:border-emerald-200 transition-all space-y-2"
                        >
                          {/* Row 1: Dish Title, Badges, Calories & Trash */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                              {/* Indian Veg / Non-Veg Indicator Dot */}
                              <span
                                className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 ${
                                  item.vegetarian ? 'border-emerald-600' : 'border-rose-600'
                                }`}
                                title={item.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    item.vegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                                  }`}
                                />
                              </span>

                              <span className="font-bold text-stone-900 text-xs sm:text-sm break-words leading-snug">
                                {item.name}
                              </span>

                              {item.gi === 'Low' && (
                                <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-1.5 py-0.2 rounded shrink-0">
                                  Low GI
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs sm:text-sm font-extrabold text-stone-900 tabular-nums font-display whitespace-nowrap">
                                {item.calories} kcal
                              </span>

                              <button
                                onClick={() => onRemoveMealItem(slot.slotKey, item.instanceId)}
                                className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Serving description */}
                          <div className="text-xs text-stone-500 font-medium">
                            Serving: <span className="text-stone-700">{item.serving}</span>
                          </div>

                          {/* Row 3: Colorful Macro Pills & Portion Stepper */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/50">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold flex-wrap">
                              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100/80">
                                P: {item.protein}g
                              </span>
                              <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-100/80">
                                C: {item.carbs}g
                              </span>
                              <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200/80">
                                F: {item.fat}g
                              </span>
                              <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-100/80">
                                Fibre: {item.fibre}g
                              </span>
                            </div>

                            {/* Portion Stepper */}
                            {baseFood && (
                              <div className="flex items-center border border-stone-200 bg-white rounded-lg p-0.5 text-xs shadow-2xs">
                                <button
                                  onClick={() => {
                                    const next = Math.max(0.5, item.portionMultiplier - 0.5);
                                    onUpdatePortion(slot.slotKey, item.instanceId, next, baseFood);
                                  }}
                                  className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded font-bold"
                                  title="Decrease portion"
                                >
                                  -
                                </button>
                                <span className="px-1.5 font-bold text-stone-800 text-[11px] tabular-nums">
                                  {item.portionMultiplier}x
                                </span>
                                <button
                                  onClick={() => {
                                    const next = item.portionMultiplier + 0.5;
                                    onUpdatePortion(slot.slotKey, item.instanceId, next, baseFood);
                                  }}
                                  className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded font-bold"
                                  title="Increase portion"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== DEDICATED CELL: COMMON RULES TO REDUCE WEIGHT ===================== */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Core Guidelines &amp; Weight Loss Habits</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-display text-stone-900">
              Essential Rules to Follow to Reduce Weight
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Follow these simple, everyday rules alongside your daily food choices for healthy, sustainable weight reduction.
            </p>
          </div>
        </div>

        {/* Universal Everyday Rules */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Everyday Non-Negotiable Rules
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Rule 1 */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                  Pre-Lunch Salad &amp; Fruit
                </h5>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Eat <strong>1 bowl of salad</strong> and <strong>1–3 fruits 15–30 minutes before lunch</strong>. Pre-loads stomach stretch receptors with fiber and digestive enzymes to naturally prevent overeating.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                  Eat Only Seasonal
                </h5>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Eat <strong>only seasonal fruits and salad</strong>. In-season produce (papaya, guava, apple, cucumber, watermelon) carries maximum live enzymes, natural hydration, and vital micronutrients.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                  Don't Overeat
                </h5>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                <strong>Don't do overeating.</strong> Stop when you are 80% full. Chew each morsel 20–30 times slowly so your brain registers satiety hormones before you overconsume.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Plan Pro Weight Reduction Advice Card */}
        {userProfile.planLevel !== 'premium' ? (
          <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 text-white rounded-2xl p-5 border border-amber-500/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                👑
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Pro Protocol
                </span>
                <h4 className="text-sm sm:text-base font-bold font-display text-white mt-1">
                  Join Premium Plan for Pro Weight Reduction Advice
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Unlock specialized morning green juices, metabolism accelerators, and personal diet advice.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPremiumModal}
              className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs sm:text-sm font-black tracking-wide transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Join Premium 199/-
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-500/10 via-stone-900 to-stone-950 text-white rounded-2xl p-4 sm:p-5 border border-amber-500/40 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold">
                  👑
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ✨ Premium Member Access Unlocked
                  </span>
                  <h4 className="text-sm sm:text-base font-bold font-display text-white mt-0.5">
                    Pro Weight Reduction Advice &amp; Habits
                  </h4>
                </div>
              </div>

              <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 self-start sm:self-center">
                Plan Active
              </span>
            </div>

            {/* Pro Tips Grid - Ready for easily adding more tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              {/* Pro Advice 1: Green Leaves Juice */}
              <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <span>🍃</span>
                  <span>Morning Green Leaves Juice (Empty Stomach)</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
                  Drink green leaves juice in the morning on an <strong>empty stomach</strong>. Extract juice from leaves like <strong>mint, coriander, curry leaves, and spinach</strong>.
                </p>
                <div className="p-2 rounded-lg bg-stone-950 border border-amber-500/30 text-[11px] text-amber-200/90 space-y-0.5">
                  <p>
                    &bull; <strong>Fresh Juice NOT Smoothie:</strong> Strain the juice, add <strong>half lemon juice</strong> and <strong>1 tsp honey</strong>.
                  </p>
                  <p className="text-rose-300 font-semibold">
                    &bull; ⚠️ DO NOT USE NEEM or any bitter-tasting leaves! Use ONLY leaves commonly used in Indian cooking or curries.
                  </p>
                </div>
              </div>

              {/* Pro Advice 2: Green Chutney with Lunch */}
              <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <span>🥣</span>
                  <span>Green Chutney with Lunch</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
                  Eat homemade <strong>Green Chutney</strong> made of green leaves like <strong>mint, coriander, and curry leaves</strong> with fresh lemon juice.
                </p>
                <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 text-[11px] text-stone-300 space-y-0.5">
                  <p>
                    &bull; Serve in a <strong>small bowl alongside lunch</strong>.
                  </p>
                  <p>
                    &bull; Add a <strong>small amount of green chilli</strong> to stimulate metabolism and salivary amylase.
                  </p>
                </div>
              </div>

              {/* Pro Advice 3: 45-Min Activity */}
              <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <span>🏃‍♂️</span>
                  <span>Consistent 45-Min Physical Exercise</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
                  Commit to a <strong>morning walk, yoga, or gym workout</strong> for at least <strong>4–5 days in a week</strong> for <strong>45 minutes a day</strong>.
                </p>
                <p className="text-[11px] text-stone-400">
                  Consistent 45-minute daily activity boosts your metabolic rate and natural fat burning.
                </p>
              </div>

              {/* Pro Advice 4: Personal Advice */}
              <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <span>🩺</span>
                  <span>Personal Diet Advice</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
                  Take <strong>personal advice for precise diet advice</strong> for targeted weight loss based on your exact body goals and daily routine.
                </p>
                <button
                  type="button"
                  onClick={onOpenExpertModal}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white underline cursor-pointer"
                >
                  <span>Book a 30-min Diet Consultation &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Water Tracking & Daily Indian Hydration */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Daily Hydration (Water & Buttermilk)
              </h3>
              <p className="text-xs text-stone-500">
                Recommended 2.5–3.0 Litres. Hydration maintains cellular metabolism and fat oxidation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-stone-900 font-display tabular-nums">
              {(dailyLog.waterIntakeLiters || 1.5).toFixed(1)} L
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateWater(-0.25)}
                className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
              >
                -250 ml
              </button>
              <button
                onClick={() => onUpdateWater(0.25)}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                +250 ml Glass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Services Prompt */}
      <div className="bg-stone-100/80 rounded-2xl p-5 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Personal Human Review
          </span>
          <h4 className="text-base font-bold text-stone-900 font-display mt-0.5">
            Get a HealthArogyaa Human Expert Review
          </h4>
          <p className="text-xs text-stone-600 max-w-xl mt-1">
            Have a clinical Indian dietitian inspect your food choices, daily meal pattern, and weight trend. Receive a detailed written review or book a 30-minute one-on-one session.
          </p>
        </div>

        <button
          onClick={onOpenExpertModal}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Explore Expert Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Wellness & Dietician Guidance Notice */}
      <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-start gap-2.5">
          <span className="text-base shrink-0">🌿</span>
          <div>
            <strong className="font-bold text-emerald-900">Guided by a Certified Dietician:</strong>{' '}
            Wellness guidance complements, but does not replace, diagnosis or treatment from your doctor. Individual results vary based on body composition and consistency.
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenDisclaimerModal}
          className="font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 text-xs whitespace-nowrap"
        >
          Read Policy &rarr;
        </button>
      </div>

      {/* Discrete Client App Footer */}
      <footer className="pt-4 border-t border-stone-200 text-center text-xs text-stone-600 space-y-1.5">
        <p className="text-[11px] text-stone-600">
          HealthArogyaa · Clinical Nutrition &amp; ICMR 2024 Energy Reference Standards
        </p>
        <div className="flex items-center justify-center gap-3 text-[11px] text-stone-600">
          <button
            onClick={onOpenDisclaimerModal}
            className="hover:text-stone-700 underline"
          >
            Medical Disclaimer
          </button>
          <span>·</span>
          <button
            onClick={onOpenNutritionAccuracyModal}
            className="hover:text-stone-700 underline"
          >
            Cooking Variance
          </button>
        </div>
      </footer>
    </div>
  );
};

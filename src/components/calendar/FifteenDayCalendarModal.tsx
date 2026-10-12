import React, { useState } from 'react';
import { UserProfile, DailyLog } from '../../types';
import { getLast15DaysHistory, DayCalorieSummary } from '../../services/storageService';
import {
  Calendar,
  X,
  CheckCircle2,
  TrendingDown,
  Flame,
  ArrowRight,
  Info,
  ChevronRight,
  Droplets,
  Award,
} from 'lucide-react';

interface FifteenDayCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSelectDateToView?: (dateStr: string) => void;
  isAdminViewing?: boolean;
}

export const FifteenDayCalendarModal: React.FC<FifteenDayCalendarModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSelectDateToView,
  isAdminViewing = false,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayCalorieSummary | null>(null);

  if (!isOpen) return null;

  const history = getLast15DaysHistory(userProfile);

  // Statistics calculation across 15 days
  const totalConsumed = history.reduce((acc, d) => acc + d.consumedCalories, 0);
  const avgConsumed = Math.round(totalConsumed / history.length);
  const onTrackDays = history.filter(d => d.adherence === 'on_track' || d.adherence === 'deficit').length;
  const complianceRate = Math.round((onTrackDays / history.length) * 100);
  const avgDeficit = userProfile.dailyCalories - avgConsumed;

  const handleSelectDay = (day: DayCalorieSummary) => {
    setSelectedDay(day);
  };

  const handleJumpToDay = (dateStr: string) => {
    if (onSelectDateToView) {
      onSelectDateToView(dateStr);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>15-Day Calorie Tracking Calendar</span>
              {isAdminViewing && (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Admin Inspection Mode
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
              {userProfile.name}'s 15-Day Journey
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Target: <strong className="text-white">{userProfile.dailyCalories} kcal/day</strong> · Evaluating consistency and fat-loss adherence
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 15-Day Metric Strip */}
        <div className="bg-stone-50 border-b border-stone-200 p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] text-stone-400 block font-semibold uppercase">15-Day Average</span>
            <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums whitespace-nowrap">
              {avgConsumed} kcal
            </span>
            <span className="text-[10px] text-stone-500 block">per day</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] text-stone-400 block font-semibold uppercase">Daily Deficit</span>
            <span className={`text-base sm:text-lg font-bold tabular-nums whitespace-nowrap ${avgDeficit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {avgDeficit >= 0 ? `-${avgDeficit}` : `+${Math.abs(avgDeficit)}`} kcal
            </span>
            <span className="text-[10px] text-stone-500 block">below TDEE burn</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] text-stone-400 block font-semibold uppercase">Adherence Rate</span>
            <span className="text-base sm:text-lg font-bold text-emerald-800 tabular-nums">
              {complianceRate}%
            </span>
            <span className="text-[10px] text-stone-500 block">{onTrackDays} of 15 on track</span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs">
            <span className="text-[10px] text-stone-400 block font-semibold uppercase">Projected 15d Loss</span>
            <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums whitespace-nowrap">
              ~{(Math.max(0, avgDeficit * 15) / 7700).toFixed(1)} kg
            </span>
            <span className="text-[10px] text-stone-500 block">pure body fat deficit</span>
          </div>
        </div>

        {/* Content Body: Calendar Grid + Inspector */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <span className="text-xs font-bold text-stone-700 block mb-2">
              Select any day to inspect meal logs &amp; macros:
            </span>

            {/* 15 Days Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {history.map(day => {
                const isSelected = selectedDay?.date === day.date;
                const diff = day.consumedCalories - day.targetCalories;

                return (
                  <button
                    key={day.date}
                    onClick={() => handleSelectDay(day)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 ring-2 ring-emerald-700/30 shadow-xs'
                        : day.isToday
                        ? 'border-stone-400 bg-stone-50 hover:border-emerald-500'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-stone-900">
                        {day.dayOfWeek}, {day.formattedDate}
                      </span>
                      {day.isToday && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="text-base font-extrabold text-stone-900 tabular-nums font-display">
                      {day.consumedCalories}{' '}
                      <span className="text-[10px] text-stone-400 font-normal">kcal</span>
                    </div>

                    {/* Adherence badge */}
                    <div className="mt-1.5 flex items-center justify-between flex-wrap gap-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                          day.adherence === 'on_track'
                            ? 'bg-emerald-100 text-emerald-800'
                            : day.adherence === 'deficit'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {day.adherence === 'on_track'
                          ? 'On Budget'
                          : day.adherence === 'deficit'
                          ? 'Deep Deficit'
                          : `+${diff} kcal`}
                      </span>

                      <span className="text-[10px] text-stone-400 tabular-nums whitespace-nowrap">
                        {day.protein}g P
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector Drawer for Selected Day */}
          {selectedDay ? (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    Day Details · {selectedDay.dayOfWeek}, {selectedDay.formattedDate} ({selectedDay.date})
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-extrabold text-stone-900 tabular-nums">
                      {selectedDay.consumedCalories} kcal
                    </span>
                    <span className="text-xs text-stone-500">
                      / {selectedDay.targetCalories} kcal Target
                    </span>
                  </div>
                </div>

                {!isAdminViewing && (
                  <button
                    onClick={() => handleJumpToDay(selectedDay.date)}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <span>View / Log on this Date</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Macro breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] block">Protein</span>
                  <span className="font-bold text-emerald-800">{selectedDay.protein}g</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] block">Carbs</span>
                  <span className="font-bold text-amber-800">{selectedDay.carbs}g</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] block">Fats</span>
                  <span className="font-bold text-stone-700">{selectedDay.fat}g</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-stone-200">
                  <span className="text-stone-400 text-[10px] block">Fibre</span>
                  <span className="font-bold text-teal-800">{selectedDay.fibre}g</span>
                </div>
              </div>

              {/* Logged Meals List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">
                  Logged Meals for this Day:
                </span>

                {selectedDay.mealsCount === 0 ? (
                  <div className="p-4 bg-white rounded-xl border border-stone-200 text-center text-xs text-stone-500">
                    No meals logged for this date yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      ...selectedDay.log.breakfast,
                      ...(selectedDay.log.preLunch || []),
                      ...selectedDay.log.lunch,
                      ...selectedDay.log.dinner,
                      ...selectedDay.log.snacks,
                    ].map(meal => (
                      <div
                        key={meal.instanceId}
                        className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="font-bold text-stone-900 block truncate">
                            {meal.name}
                          </span>
                          <span className="text-[11px] text-stone-400 block truncate">
                            {meal.category} · {meal.serving}
                          </span>
                        </div>
                        <span className="font-bold text-stone-900 tabular-nums shrink-0 whitespace-nowrap">
                          {meal.calories} kcal
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-center text-xs text-stone-500">
              Tap any date card above to inspect that day's meal selections and macronutrient splits.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Consistency over 15 days is the true driver of metabolic adaptation.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

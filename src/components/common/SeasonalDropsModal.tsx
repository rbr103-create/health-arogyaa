import React, { useState } from 'react';
import { SeasonalDrop, UserProfile } from '../../types';
import { SEASONAL_DROPS } from '../../data/seasonalDrops';
import {
  X,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Utensils,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

interface SeasonalDropsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onOpenPremiumModal: () => void;
}

export const SeasonalDropsModal: React.FC<SeasonalDropsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenPremiumModal,
}) => {
  const [selectedDropId, setSelectedDropId] = useState<string>(SEASONAL_DROPS[0].id);

  if (!isOpen) return null;

  const isPremium = userProfile.planLevel === 'premium';
  const selectedDrop =
    SEASONAL_DROPS.find(d => d.id === selectedDropId) || SEASONAL_DROPS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-stone-950 text-white p-5 border-b border-stone-800 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HealthArogyaa Seasonal &amp; Festive Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5 text-white">
              Seasonal &amp; Festival Meal Drops
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Dynamic nutritional strategies tailored to Indian weather cycles, celebrations, and festive seasons.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors relative z-10 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 border-b border-stone-200 overflow-x-auto text-xs font-semibold scrollbar-none">
          {SEASONAL_DROPS.map(drop => {
            const isSelected = drop.id === selectedDropId;
            return (
              <button
                key={drop.id}
                onClick={() => setSelectedDropId(drop.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'bg-white text-stone-700 hover:bg-stone-200/90 border border-stone-200 font-medium'
                }`}
              >
                <span>{drop.bannerEmoji}</span>
                <span>{drop.title.split(' ')[0]} Drop</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Active Drop Hero */}
          <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-stone-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{selectedDrop.bannerEmoji}</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md inline-block">
                    {selectedDrop.seasonName}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-display mt-0.5">
                    {selectedDrop.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {selectedDrop.tagline}
                  </p>
                </div>
              </div>

              {isPremium ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Premium Unlocked
                </span>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPremiumModal();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Full Guide</span>
                </button>
              )}
            </div>

            {/* Core Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-amber-200/60">
              {selectedDrop.keyBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Seasonal Foods with exact macros */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm font-display mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-700" />
              <span>Recommended Seasonal Dishes &amp; Portions</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedDrop.recommendedFoods.map((food, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-colors space-y-1.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">
                      {food.name}
                    </span>
                    <span className="font-extrabold text-emerald-700 text-xs tabular-nums shrink-0">
                      ~{food.calories} kcal
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">
                    Portion: <span className="text-stone-800">{food.portion}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {food.benefits}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Swaps Table (Avoid vs Choose) */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm font-display mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>High-Impact Nutritional Swaps</span>
            </h4>

            <div className="space-y-2.5">
              {selectedDrop.swaps.map((swap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-rose-700">
                      <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-[10px] shrink-0">
                        ✕
                      </span>
                      <span className="font-medium line-through">{swap.avoid}</span>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 hidden sm:block shrink-0" />

                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-[10px] shrink-0">
                        ✓
                      </span>
                      <span>{swap.choose}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 pl-6">
                    {swap.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Lifestyle Rule */}
          <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-800/80 flex items-start gap-3 text-xs leading-relaxed">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Clinical Protocol:</strong>
              {selectedDrop.lifestyleTip}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {isPremium
              ? 'Included in your HealthArogyaa Transformation subscription.'
              : 'Unlock continuous seasonal intelligence with Premium (from ₹150/mo).'}
          </div>

          {!isPremium ? (
            <button
              onClick={() => {
                onClose();
                onOpenPremiumModal();
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Upgrade Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

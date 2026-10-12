import React, { useState } from 'react';
import {
  Info,
  X,
  Scale,
  Flame,
  CheckCircle2,
  Droplet,
  Utensils,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface NutritionAccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionAccuracyModal: React.FC<NutritionAccuracyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [extraTspOil, setExtraTspOil] = useState<number>(0);
  const [extraTspGhee, setExtraTspGhee] = useState<number>(0);

  if (!isOpen) return null;

  const oilCalories = extraTspOil * 45;
  const gheeCalories = extraTspGhee * 45;
  const totalVarianceKcal = oilCalories + gheeCalories;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Scale className="w-3.5 h-3.5" />
              <span>Nutritional Science & Transparency</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
              Are Nutrition Values Actual or Approximate?
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Understanding the ±10% to 15% variation in Indian home cooking
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-stone-800">
          {/* Quick Answer Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
              The Definitive Answer
            </span>
            <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
              All nutritional values in HealthArogyaa are <strong>scientifically calibrated approximations</strong>, grounded in standard laboratory recipes and ICMR-NIN (National Institute of Nutrition) reference tables, with an expected variance of <strong>±10% to 15%</strong> across different households.
            </p>
          </div>

          {/* 3 Main Reasons for Variance */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Why Does Indian Cooking Have a 10%–15% Variation?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold mb-2">
                  🫒
                </div>
                <h4 className="text-xs font-bold text-stone-900">1. Cooking Oil & Ghee</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  The single biggest variable. Just <strong>1 extra teaspoon of mustard, groundnut, or refined oil</strong> adds <strong>~45 kcal</strong>, while 1 tablespoon of desi ghee adds <strong>~112 kcal</strong>.
                </p>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold mb-2">
                  🥣
                </div>
                <h4 className="text-xs font-bold text-stone-900">2. Household Katori Size</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  A standard Indian katori is approximately <strong>150 ml</strong>. However, household bowls range from 120 ml to 220 ml. A thicker roti or larger katori of dal shifts calories by ~10–12%.
                </p>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold mb-2">
                  🌾
                </div>
                <h4 className="text-xs font-bold text-stone-900">3. Moisture & Grain Brand</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  How much water a sabzi or dal is reduced by alters the density per spoon. Different wheat varieties (Sharbaati vs MP Lokwan) have slight protein/carbohydrate variances.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Oil / Preparation Variance Calculator */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  Interactive Oil & Ghee Variance Calculator
                </h4>
                <p className="text-[11px] text-stone-500">
                  Did your family use more oil or ghee in today's preparation? Test the impact:
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full tabular-nums whitespace-nowrap self-start sm:self-center">
                +{totalVarianceKcal} kcal impact
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-800 block">Extra Cooking Oil (tsp)</span>
                  <span className="text-[10px] text-stone-400">1 tsp = 45 kcal (5ml fat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExtraTspOil(Math.max(0, extraTspOil - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="font-bold text-xs tabular-nums w-4 text-center">{extraTspOil}</span>
                  <button
                    onClick={() => setExtraTspOil(extraTspOil + 1)}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-800 block">Desi Ghee on Roti / Dal (tsp)</span>
                  <span className="text-[10px] text-stone-400">1 tsp = 45 kcal (pure lipid)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExtraTspGhee(Math.max(0, extraTspGhee - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="font-bold text-xs tabular-nums w-4 text-center">{extraTspGhee}</span>
                  <button
                    onClick={() => setExtraTspGhee(extraTspGhee + 1)}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Why HealthArogyaa's Methodology Works Despite Variance */}
          <div className="bg-stone-900 text-stone-200 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              Why You Still Lose Weight
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              The 500 kcal Deficit Buffer
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              When HealthArogyaa sets your weight loss target at a 500 kcal deficit (e.g. eating 1,800 kcal against a 2,300 kcal expenditure), even if your daily meals vary by ±15% (~150–200 kcal), <strong>you remain in a solid 300–350 kcal fat-loss deficit every single day</strong>. Consistency beats laboratory perfection.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Source: ICMR-NIN Indian Food Composition Tables (IFCT)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};

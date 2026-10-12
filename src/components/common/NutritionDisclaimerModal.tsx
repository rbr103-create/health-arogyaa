import React from 'react';
import { ShieldAlert, X, HelpCircle, CheckCircle2, Scale, BookOpen, AlertTriangle } from 'lucide-react';

interface NutritionDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionDisclaimerModal: React.FC<NutritionDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display">
                Medical Disclaimer &amp; Nutrition Accuracy
              </h2>
              <p className="text-xs text-stone-300">
                Transparency on healthcare boundaries and cooking variations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs text-stone-700">
          {/* SECTION 1: Medical Disclaimer */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>1. Health &amp; Medical Practice Disclaimer</span>
            </div>
            <p className="text-amber-950 leading-relaxed">
              <strong>HealthArogyaa is not a doctor, medical hospital, or clinical diagnostic provider.</strong> The materials, calorie calculators, BMI evaluations, food recommendations, and written assessments are provided strictly for informational and habit-building purposes.
            </p>
            <p className="text-amber-900 leading-relaxed">
              Never disregard or delay seeking professional medical advice because of something you have read or calculated in this application. If you have pre-existing medical conditions (such as Type 1 or Type 2 Diabetes, Chronic Kidney Disease, Hypertension, Pregnancy, or Thyroid Disorders), consult your physician before altering your diet or calorie intake.
            </p>
          </div>

          {/* SECTION 2: Actual vs. Approximate Nutrition Science */}
          <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>2. Nutritional Values: Actual vs. Approximate &amp; Expected Variation</span>
            </div>

            <p className="text-stone-700 leading-relaxed">
              <strong>How our values are established:</strong> All baseline nutritional values in HealthArogyaa are referenced from verified scientific Indian nutritional literature, including the <em>Indian Food Composition Tables (IFCT)</em> published by the National Institute of Nutrition (ICMR-NIN) and USDA food data.
            </p>

            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-900 block">
                How much variation is natural in cooked Indian foods?
              </span>
              <p className="text-stone-600 leading-relaxed">
                In culinary and nutrition science, cooked meals naturally exhibit a <strong>5% to 15% standard variation</strong>. This is because:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-stone-600">
                <li><strong>Cooking Fat (Ghee / Oil):</strong> 1 additional teaspoon of cooking oil in a sabzi or tadka adds ~45 kcal.</li>
                <li><strong>Portion Thickness:</strong> A thick paratha vs. a paper-thin phulka varies from 80 kcal to 140 kcal.</li>
                <li><strong>Grain Variety:</strong> Different varieties of polished white rice vs. brown rice or hand-pounded red rice have slight carbohydrate differences.</li>
                <li><strong>Moisture &amp; Gravy Density:</strong> Thicker dal has a higher calorie density per bowl than a thin rasam or soup.</li>
              </ul>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
              <span className="font-bold block flex items-center gap-1.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Why HealthArogyaa is still clinically effective:
              </span>
              <p className="text-xs leading-relaxed">
                Sustainable weight loss relies on consistent energetic trends, not single-digit micro-calorie obsession. Tracking with our standardized Indian portions guarantees you remain reliably inside your required fat-loss deficit zone (300–500 kcal deficit).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Backed by ICMR-NIN Indian food composition benchmarks.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};

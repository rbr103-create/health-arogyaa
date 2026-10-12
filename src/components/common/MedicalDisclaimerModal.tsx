import React from 'react';
import {
  Award,
  X,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

interface MedicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Dietician Guidance</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display mt-0.5">
                Wellness &amp; Health Disclaimer
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-stone-800 text-xs sm:text-sm leading-relaxed">
          {/* Main Professional Statement */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-950 text-sm">
                Certified Dietary Guidance
              </h3>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                HealthArogyaa is developed and curated by a <strong>Certified Dietician &amp; Indian Nutrition Expert</strong>.
              </p>
            </div>
          </div>

          {/* The Exact Core Message Requested by User */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-semibold">
              &quot;Wellness guidance complements, but does not replace, diagnosis or treatment from your doctor. Individual results vary.&quot;
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our nutritional recommendations, calorie calculations, and meal choices are designed to support healthy, sustainable weight management and nutritional awareness.
            </p>
          </div>

          {/* Key Points - Concise & Clear */}
          <div className="space-y-2 text-stone-600 text-xs pt-1">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Complements Medical Care:</strong> Always continue prescribed treatments and consult your personal physician regarding any pre-existing medical conditions or specific medical diagnoses.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Individual Variation:</strong> Body composition, metabolic rate, activity level, and medical history vary from person to person; progress timeline differs for every individual.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Sustainable Habits:</strong> We believe in flexible Indian meal choices and portion balance rather than extreme starvation diets.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            HealthArogyaa · Certified Nutrition
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Understood &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};

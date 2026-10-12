import React from 'react';
import {
  Lightbulb,
  X,
  Database,
  Cpu,
  UserCheck,
  Sparkles,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const pipelineStages = [
    {
      step: '1',
      title: 'HealthArogyaa Methodology',
      subtitle: 'Clinical Caloric Deficit & Asian Indian Metabolic Brackets',
      description:
        'Calculates Resting Metabolic Rate (Mifflin-St Jeor) and TDEE adjusted for Asian Indian body composition. Enforces a sustainable 300–500 kcal deficit without starvation.',
      icon: '📐',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      step: '2',
      title: 'Curated Indian Food Database',
      subtitle: '150+ Verified Home Cooked & Regional Foods',
      description:
        'Nutritional profiling (Carbs, Protein, Fat, Fibre, Sugar, GI/GL) calibrated for Indian kitchens (Besan Chilla, Moong Dal, Roti, Khichdi, Poha, Sambar, Chicken Curry). Fully offline & owned.',
      icon: '🥘',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      step: '3',
      title: 'Rule-Based Recommendation Engine',
      subtitle: 'Deterministic Filtering & Smart Food Swaps',
      description:
        'Eliminates user dislikes (e.g. paneer, dairy, spicy), respects dietary identity (Veg, Non-Veg, Vegan), aligns with grain preferences (Roti vs Rice), and balances daily macros with zero external AI latency or costs.',
      icon: '⚙️',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    {
      step: '4',
      title: 'User Choice & Sustainable Autonomy',
      subtitle: 'Know Your Food. Choose Your Meal. Build Your Day.',
      description:
        'The user builds their day by selecting foods they genuinely like. No rigid diet charts that fail after 2 weeks; long-term sustainable behavioral change.',
      icon: '👤',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    {
      step: '5',
      title: 'AI Helps Where Useful (Assistive Only)',
      subtitle: 'Computer Vision Scanner & Conversational Helper',
      description:
        'AI is applied strictly at the periphery: OCR reading of packaged nutrition labels and instant camera photo identification. If AI pricing changes or the API is unavailable, the entire core app works 100% uninterrupted.',
      icon: '✨',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Core Product Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
              The HealthArogyaa Methodology
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Why our methodology is the centre—not an AI wrapper
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
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Defensible Architecture Banner */}
          <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl border border-stone-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>A Resilient & Defensible System</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              &quot;I wouldn't make AI the centre of the HealthArogyaa app. I'd make your methodology the centre. That's much more defensible. If tomorrow an AI provider changes its pricing or becomes unavailable, our core app still works seamlessly.&quot;
            </p>
          </div>

          {/* 5-Stage Diagram */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              The 5-Stage Flow of HealthArogyaa:
            </h3>

            <div className="space-y-2.5">
              {pipelineStages.map((stage, idx) => (
                <React.Fragment key={stage.step}>
                  <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/80 hover:bg-stone-50 transition-colors flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-sm font-bold shadow-2xs shrink-0">
                      {stage.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
                          Stage {stage.step}
                        </span>
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                          {stage.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800 block mt-0.5">
                        {stage.subtitle}
                      </span>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {idx < pipelineStages.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <ArrowDown className="w-4 h-4 text-stone-400 animate-pulse" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Key Advantages Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-950 block mb-1">
                Zero Vendor Lock-in
              </span>
              <p className="text-stone-700 text-[11px] leading-relaxed">
                Calculations, food tables, meal combinations, swaps, and 15-day adherence are computed instantly in-browser without waiting for external server queues.
              </p>
            </div>

            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-950 block mb-1">
                Predictable Economics
              </span>
              <p className="text-stone-700 text-[11px] leading-relaxed">
                Our ₹199/month subscription maintains high operating margins because the core methodology runs deterministically without burning expensive LLM tokens on every click.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            HealthArogyaa™ Proprietary Methodology
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

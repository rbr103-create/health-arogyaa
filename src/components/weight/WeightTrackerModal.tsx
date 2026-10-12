import React, { useState } from 'react';
import { UserProfile, WeightRecord } from '../../types';
import { calculateBMI, calculateMilestoneProgress, formatHeight } from '../../utils/nutritionCalculators';
import {
  Scale,
  X,
  Sparkles,
  Trophy,
  Gift,
  ArrowRight,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Ruler,
  Info,
} from 'lucide-react';

interface WeightTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  weightRecords: WeightRecord[];
  onAddWeightRecord: (weightKg: number, notes?: string) => void;
  onClaimFreeMonth: () => void;
  onUpdateHeight?: (heightCm: number) => void;
}

export const WeightTrackerModal: React.FC<WeightTrackerModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  weightRecords,
  onAddWeightRecord,
  onClaimFreeMonth,
  onUpdateHeight,
}) => {
  const [newWeight, setNewWeight] = useState<string>(userProfile.weightKg.toString());
  const [currentHeight, setCurrentHeight] = useState<string>(userProfile.heightCm.toString());
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [notes, setNotes] = useState('');
  const [celebrationData, setCelebrationData] = useState<{
    startingWeight: number;
    currentWeight: number;
    lostKg: number;
    percentChange: number;
    is5PercentMilestone: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const heightVal = parseFloat(currentHeight) || userProfile.heightCm || 165;
  const weightVal = parseFloat(newWeight) || userProfile.weightKg || 70;
  const currentBMI = calculateBMI(weightVal, heightVal);
  const heightInfo = formatHeight(heightVal);

  // Quick simulation buttons for testing milestone celebrations!
  const simulateMilestones = [
    { label: '84.0 kg (-1.2%)', val: 84.0 },
    { label: '82.5 kg (-3.0%)', val: 82.5 },
    { label: '80.7 kg (-5.1% Free Month!)', val: 80.7 },
  ];

  const handleSubmit = (weightToLog: number, noteStr?: string) => {
    if (isNaN(weightToLog) || weightToLog <= 30 || weightToLog >= 250) {
      alert('Please enter a valid weight between 30 and 250 kg.');
      return;
    }

    if (onUpdateHeight && heightVal !== userProfile.heightCm) {
      onUpdateHeight(heightVal);
    }

    const startingWeight = userProfile.startingWeightKg;
    const progress = calculateMilestoneProgress(startingWeight, weightToLog);

    onAddWeightRecord(weightToLog, noteStr || notes);

    // If progress shows a milestone reached, trigger celebration modal
    if (progress.isLoss && progress.highestMilestone !== null) {
      setCelebrationData({
        startingWeight,
        currentWeight: weightToLog,
        lostKg: progress.lostKg,
        percentChange: progress.percentChange,
        is5PercentMilestone: progress.qualifiesForFreeMonth,
      });
    } else {
      onClose();
    }
  };

  const handleClaim = () => {
    onClaimFreeMonth();
    setCelebrationData(null);
    onClose();
  };

  // BMI Position on visual scale (15 to 35 range)
  const bmiClamp = Math.min(35, Math.max(15, currentBMI.bmi));
  const bmiPercent = ((bmiClamp - 15) / (35 - 15)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Celebration Overlay if Milestone hit! */}
        {celebrationData ? (
          <div className="p-6 text-center space-y-5 bg-gradient-to-b from-emerald-50 via-white to-white">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Milestone Achieved!
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 font-display">
                🎉 Great progress!
              </h2>
              <p className="text-sm text-stone-600">
                You've reached an important milestone in your HealthArogyaa journey.
              </p>
            </div>

            {/* Weight Progression Block */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 flex items-center justify-around">
              <div>
                <span className="text-[11px] text-stone-400 block">Starting Weight</span>
                <span className="text-lg font-bold text-stone-700 tabular-nums">
                  {celebrationData.startingWeight.toFixed(1)} kg
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[11px] text-emerald-700 font-semibold block">New Milestone</span>
                <span className="text-2xl font-extrabold text-emerald-800 tabular-nums font-display">
                  {celebrationData.currentWeight.toFixed(1)} kg
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              That's a <strong className="text-stone-900">{celebrationData.lostKg} kg</strong> ({celebrationData.percentChange}%) sustainable reduction from your starting weight.
            </p>

            {/* Milestone Reward Box if >= 5% */}
            {celebrationData.is5PercentMilestone ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Gift className="w-4 h-4 text-amber-700" />
                  <span>🎁 Your Reward: 1 Month of HealthArogyaa Premium — FREE!</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Congratulations on reaching &gt;5% fat reduction. We have automatically activated 1 month of Premium recommendations, detailed GI/GL analytics, and AI scanner benefits for your account.
                </p>
                <button
                  onClick={handleClaim}
                  className="w-full mt-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Claim My Free Month & Continue
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCelebrationData(null);
                  onClose();
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Keep Building Your Healthier Routine
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                    Weight Progress & BMI Analysis
                  </h2>
                  <p className="text-xs text-stone-500">
                    Clinical parameters for {userProfile.name}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Dual Height & Weight Showcase Banner */}
              <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-2xl p-4 border border-stone-800 shadow-xs space-y-3">
                <div className="grid grid-cols-2 gap-3 divide-x divide-stone-800">
                  {/* Height Parameter */}
                  <div className="pr-2">
                    <div className="flex items-center justify-between text-stone-400 text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 text-emerald-400" />
                        Height
                      </span>
                      <button
                        onClick={() => setIsEditingHeight(!isEditingHeight)}
                        className="text-emerald-400 hover:underline text-[10px]"
                      >
                        {isEditingHeight ? 'Done' : 'Change'}
                      </button>
                    </div>

                    {isEditingHeight ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <input
                          type="number"
                          value={currentHeight}
                          onChange={e => setCurrentHeight(e.target.value)}
                          className="w-20 px-2 py-1 bg-stone-800 border border-stone-700 rounded text-sm text-white font-bold"
                          placeholder="cm"
                        />
                        <span className="text-xs text-stone-400">cm</span>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <span className="text-2xl font-extrabold text-white tabular-nums font-display">
                          {heightVal}
                        </span>
                        <span className="text-xs text-stone-300 ml-1">cm</span>
                        <span className="text-[11px] text-stone-400 block font-medium">
                          ({heightInfo.feetInches})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Weight Parameter */}
                  <div className="pl-4">
                    <div className="flex items-center justify-between text-stone-400 text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-emerald-400" />
                        Weight
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Target {userProfile.targetWeightKg} kg
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-2xl font-extrabold text-white tabular-nums font-display">
                        {weightVal.toFixed(1)}
                      </span>
                      <span className="text-xs text-stone-300 ml-1">kg</span>
                      <span className="text-[11px] text-stone-400 block font-medium">
                        Start: {userProfile.startingWeightKg} kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* BMI Result Row */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-semibold">
                      Calculated BMI (Weight / Height²)
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-bold text-white tabular-nums">
                        {currentBMI.bmi}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          currentBMI.category === 'Normal'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : currentBMI.category === 'Underweight'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : currentBMI.category === 'Overweight'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {currentBMI.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">
                      Healthy Weight for {heightVal} cm
                    </span>
                    <span className="text-xs font-bold text-emerald-400 tabular-nums">
                      {currentBMI.idealWeightRange.min} – {currentBMI.idealWeightRange.max} kg
                    </span>
                  </div>
                </div>

                {/* Visual Spectrum Gauge */}
                <div className="space-y-1 pt-1">
                  <div className="relative w-full h-2.5 rounded-full overflow-hidden flex">
                    <div className="w-[17.5%] bg-amber-400" title="Underweight <18.5" />
                    <div className="w-[22%] bg-emerald-500" title="Normal 18.5-22.9" />
                    <div className="w-[10%] bg-amber-500" title="Overweight 23.0-24.9" />
                    <div className="w-[50.5%] bg-rose-500" title="Obese ≥25.0" />
                  </div>
                  <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                    <span>18.5 (Under)</span>
                    <span className="text-emerald-400 font-bold">22.9 (Healthy)</span>
                    <span>25.0 (Obese)</span>
                  </div>
                </div>
              </div>

              {/* Log Input */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                <label className="text-xs font-bold text-stone-800 block">
                  Log Today's Weight Entry:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={e => setNewWeight(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-lg font-bold text-stone-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. 65.0"
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-semibold text-stone-400">
                      kg
                    </span>
                  </div>
                  <button
                    onClick={() => handleSubmit(parseFloat(newWeight))}
                    className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                  >
                    Save Entry
                  </button>
                </div>

                {/* Instant Simulation Shortcuts for Milestone Testing */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                    Test Weight Change Scenarios:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {simulateMilestones.map(m => (
                      <button
                        key={m.label}
                        onClick={() => {
                          setNewWeight(m.val.toString());
                          handleSubmit(m.val, 'Simulation test milestone');
                        }}
                        className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 transition-colors"
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weight History List */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-800 block">
                  Logged Weight Journey:
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {weightRecords.slice().reverse().map(rec => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-xs"
                    >
                      <div className="flex items-center gap-2 text-stone-600">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{rec.date}</span>
                        {rec.notes && <span className="text-stone-400">· {rec.notes}</span>}
                      </div>
                      <span className="font-bold text-stone-900 tabular-nums">
                        {rec.weightKg.toFixed(1)} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
              <span>BMI utilizes Asian Indian consensus guidelines for accuracy.</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-100"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

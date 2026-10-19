import React, { useState, useEffect } from 'react';
import { UserProfile, DietType } from '../../types';
import { HealthArogyaaLogo } from '../common/HealthArogyaaLogo';
import { calculateBMI, calculateDailyCalorieTarget } from '../../utils/nutritionCalculators';
import { PRESET_USERS } from '../../data/mockUsers';
import {
  User,
  X,
  Check,
  Flame,
  Activity,
  Heart,
  Sliders,
  Sparkles,
  Lock,
  UserPlus,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  allUsers: UserProfile[];
  onSaveProfile: (profile: UserProfile) => void;
  onSwitchUser: (userId: string) => void;
  onOpenAdminLogin?: () => void;
  onOpenOnboarding?: () => void;
  onDeleteProfile?: (userId: string) => void;
  onResetTester?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  allUsers,
  onSaveProfile,
  onSwitchUser,
  onOpenAdminLogin,
  onOpenOnboarding,
  onDeleteProfile,
  onResetTester,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [rawAge, setRawAge] = useState<string>(String(userProfile.age));
  const [rawHeight, setRawHeight] = useState<string>(String(userProfile.heightCm));
  const [rawWeight, setRawWeight] = useState<string>(String(userProfile.weightKg));
  const [rawTargetWeight, setRawTargetWeight] = useState<string>(String(userProfile.targetWeightKg));
  const [dislikeInput, setDislikeInput] = useState(userProfile.dislikes.join(', '));
  const [allergiesInput, setAllergiesInput] = useState((userProfile.allergies || []).join(', '));

  useEffect(() => {
    setFormData(userProfile);
    setRawAge(String(userProfile.age));
    setRawHeight(String(userProfile.heightCm));
    setRawWeight(String(userProfile.weightKg));
    setRawTargetWeight(String(userProfile.targetWeightKg));
    setDislikeInput(userProfile.dislikes.join(', '));
    setAllergiesInput((userProfile.allergies || []).join(', '));
  }, [userProfile]);

  if (!isOpen) return null;

  // Recalculate metrics on input changes
  const parsedWeight = parseFloat(rawWeight) || formData.weightKg || 70;
  const parsedHeight = parseInt(rawHeight, 10) || formData.heightCm || 165;
  const parsedAge = parseInt(rawAge, 10) || formData.age || 30;
  const parsedTargetWeight = parseFloat(rawTargetWeight) || formData.targetWeightKg || 65;

  const bmiInfo = calculateBMI(parsedWeight, parsedHeight);
  const calorieCalcs = calculateDailyCalorieTarget(
    formData.sex,
    parsedWeight,
    parsedHeight,
    parsedAge,
    formData.activityLevel,
    formData.goal
  );

  const handleSave = () => {
    const dislikesArr = dislikeInput
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const allergiesArr = allergiesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updated: UserProfile = {
      ...formData,
      age: parsedAge,
      heightCm: parsedHeight,
      weightKg: parsedWeight,
      targetWeightKg: parsedTargetWeight,
      dislikes: dislikesArr,
      allergies: allergiesArr,
      dailyCalories: calorieCalcs.dailyCalories,
      proteinTargetGrams: calorieCalcs.proteinGrams,
      carbsTargetGrams: calorieCalcs.carbsGrams,
      fatTargetGrams: calorieCalcs.fatGrams,
      fibreTargetGrams: calorieCalcs.fibreGrams,
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center border border-emerald-500/20">
              <HealthArogyaaLogo className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Modules 1-5 · Health Profile
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-xs text-stone-500">Mifflin-St Jeor Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                User Profile &amp; Calorie Requirement
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Active Profile Switcher & Sign Up New Profile */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800">
                Active Profiles ({allUsers.length}):
              </span>
              <div className="flex items-center gap-1.5">
                {onOpenOnboarding && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOnboarding();
                    }}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3 text-emerald-300" />
                    <span>+ Make New Profile</span>
                  </button>
                )}
                {onResetTester && (
                  <button
                    type="button"
                    onClick={() => onResetTester()}
                    className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Reset to fresh member to test first-launch onboarding"
                  >
                    <RotateCcw className="w-2.5 h-2.5 text-stone-600" />
                    <span>Test Fresh Induction</span>
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {allUsers.map(p => (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all relative ${
                    userProfile.id === p.id
                      ? 'border-emerald-700 bg-emerald-50/70 font-semibold text-emerald-950 shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSwitchUser(p.id)}
                    className="w-full text-left cursor-pointer"
                  >
                    <div className="font-bold truncate flex items-center justify-between pr-4">
                      <span>{p.name}</span>
                      {userProfile.id === p.id && (
                        <span className="text-[10px] text-emerald-700 font-extrabold">Active</span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {p.age}y · {p.weightKg}kg · {p.dietPreference}
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">
                      Target: {p.dailyCalories} kcal
                    </div>
                  </button>
                  {allUsers.length > 1 && onDeleteProfile && userProfile.id !== p.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProfile(p.id);
                      }}
                      className="absolute top-2 right-2 text-stone-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                      title={`Delete profile ${p.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Calculation Output Box */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-white p-2 sm:p-2.5 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-stone-500 block uppercase font-medium">
                Clinical BMI
              </span>
              <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">
                {bmiInfo.bmi}
              </span>
              <span className={`text-[10px] font-bold block ${bmiInfo.categoryColor}`}>
                {bmiInfo.category}
              </span>
            </div>

            <div className="bg-white p-2 sm:p-2.5 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-stone-500 block uppercase font-medium">
                Resting BMR
              </span>
              <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums whitespace-nowrap">
                {calorieCalcs.bmr}
              </span>
              <span className="text-[10px] text-stone-400 block">kcal/day</span>
            </div>

            <div className="bg-white p-2 sm:p-2.5 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-stone-500 block uppercase font-medium">
                Total TDEE
              </span>
              <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums whitespace-nowrap">
                {calorieCalcs.tdee}
              </span>
              <span className="text-[10px] text-stone-400 block">burn rate</span>
            </div>

            <div className="bg-emerald-700 text-white p-2 sm:p-2.5 rounded-lg shadow-xs">
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">
                Daily Target
              </span>
              <span className="text-base sm:text-lg font-extrabold text-white tabular-nums font-display whitespace-nowrap">
                {calorieCalcs.dailyCalories}
              </span>
              <span className="text-[10px] text-emerald-100 block font-medium">kcal/day</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Biological Sex
              </label>
              <select
                value={formData.sex}
                onChange={e => setFormData({ ...formData, sex: e.target.value as 'Male' | 'Female' })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Age (years)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 35"
                value={rawAge}
                onChange={e => setRawAge(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => {
                  if (!rawAge || Number(rawAge) < 10) setRawAge('30');
                }}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Height (cm)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 170"
                value={rawHeight}
                onChange={e => setRawHeight(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => {
                  if (!rawHeight || Number(rawHeight) < 100) setRawHeight('165');
                }}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Current Weight (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 70"
                value={rawWeight}
                onChange={e => setRawWeight(e.target.value.replace(/[^0-9.]/g, ''))}
                onBlur={() => {
                  if (!rawWeight || Number(rawWeight) < 30) setRawWeight('70');
                }}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Target Weight (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 65"
                value={rawTargetWeight}
                onChange={e => setRawTargetWeight(e.target.value.replace(/[^0-9.]/g, ''))}
                onBlur={() => {
                  if (!rawTargetWeight || Number(rawTargetWeight) < 30) setRawTargetWeight('65');
                }}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Activity Level
              </label>
              <select
                value={formData.activityLevel}
                onChange={e => setFormData({ ...formData, activityLevel: e.target.value as any })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sedentary">Sedentary (Desk job, little exercise)</option>
                <option value="lightly_active">Lightly Active (1-3 days walk/exercise)</option>
                <option value="moderately_active">Moderately Active (3-5 days workout)</option>
                <option value="very_active">Very Active (6-7 days hard training)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Goal
              </label>
              <select
                value={formData.goal}
                onChange={e => setFormData({ ...formData, goal: e.target.value as any })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="weight_loss">Weight Loss (500 kcal deficit)</option>
                <option value="mild_weight_loss">Mild Weight Loss (300 kcal deficit)</option>
                <option value="maintenance">Maintenance (Stable weight)</option>
                <option value="muscle_gain">Muscle Tone (+300 kcal surplus)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Diet Preference
              </label>
              <select
                value={formData.dietPreference}
                onChange={e => setFormData({ ...formData, dietPreference: e.target.value as DietType })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Veg">Vegetarian</option>
                <option value="Eggetarian">Eggetarian (Veg + Eggs)</option>
                <option value="Non-Veg">Non-Vegetarian (Chicken, Fish, Eggs)</option>
                <option value="Vegan">100% Plant-Based (Vegan)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Disliked / Avoided Foods (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. paneer, spicy, dairy"
                value={dislikeInput}
                onChange={e => setDislikeInput(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                The recommendation engine automatically filters out these items.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Allergies &amp; Intolerances (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Lactose / Dairy, Gluten, Peanuts"
                value={allergiesInput}
                onChange={e => setAllergiesInput(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Foods with allergen tags will be flagged or avoided in smart meal recommendations.
              </span>
            </div>
          </div>

          {/* Grain Preference Checkboxes */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2">
            <span className="text-xs font-bold text-stone-800 block">
              Grain & Staple Preferences:
            </span>
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.likesRoti}
                  onChange={e => setFormData({ ...formData, likesRoti: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-stone-800">Likes Roti / Phulkas</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.likesRice}
                  onChange={e => setFormData({ ...formData, likesRice: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-stone-800">Likes Steamed / Brown Rice</span>
              </label>
            </div>
          </div>

          {/* Subscription Tier & Graceful Downgrade Simulator (Tactics A & D) */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">
                Subscription Plan Status:
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  formData.planLevel === 'premium'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {formData.planLevel === 'premium' ? '👑 Premium Transformation' : '🌱 Free Tier (Gracefully Downgraded)'}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    planLevel: formData.planLevel === 'premium' ? 'free' : 'premium',
                    premiumExpiresAt:
                      formData.planLevel === 'premium'
                        ? undefined
                        : new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
                    monthlyReviewTokensRemaining:
                      formData.planLevel === 'premium' ? 0 : 3,
                  })
                }
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  formData.planLevel === 'premium'
                    ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {formData.planLevel === 'premium'
                  ? 'Simulate Plan Expiry (Graceful Downgrade to Free)'
                  : 'Activate 3-Month Transformation Plan (Pro)'}
              </button>
            </div>
            <p className="text-[10px] text-stone-500">
              Test Tactic D: On the Free Tier, AI Scanner is capped at 3 scans, detailed macro bars lock, and adaptive deficit pauses.
            </p>
          </div>

          {/* Certified Dietician Notice */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 flex items-start gap-2">
            <span className="text-xs">🌿</span>
            <div>
              <strong>Certified Dietician Guidance:</strong> Wellness guidance complements, but does not replace, diagnosis or treatment from your doctor. Individual results vary.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 text-xs font-semibold hover:bg-stone-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save & Recalculate Calorie Target</span>
          </button>
        </div>
      </div>
    </div>
  );
};

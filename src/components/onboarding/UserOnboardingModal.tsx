import React, { useState } from 'react';
import { UserProfile, DietType } from '../../types';
import { calculateBMI, calculateDailyCalorieTarget, formatHeight } from '../../utils/nutritionCalculators';
import {
  UserPlus,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Flame,
  Scale,
  Ruler,
  Utensils,
  Heart,
} from 'lucide-react';

interface UserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (newProfile: UserProfile) => void;
}

export const UserOnboardingModal: React.FC<UserOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State with user's requested induction fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number>(35);
  const [sex, setSex] = useState<'Male' | 'Female'>('Male');
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(80);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(72);
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>('sedentary');
  const [goal, setGoal] = useState<UserProfile['goal']>('weight_loss');

  // Dietary preferences
  const [dietPreference, setDietPreference] = useState<DietType>('Veg');
  const [cuisinePreference, setCuisinePreference] = useState('Pan-Indian');
  const [likesRoti, setLikesRoti] = useState(true);
  const [likesRice, setLikesRice] = useState(true);
  const [dislikesInput, setDislikesInput] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  if (!isOpen) return null;

  const heightInfo = formatHeight(heightCm);
  const bmiInfo = calculateBMI(weightKg, heightCm);
  const calorieCalcs = calculateDailyCalorieTarget(
    sex,
    weightKg,
    heightCm,
    age,
    activityLevel,
    goal
  );

  const allergyOptions = [
    'Lactose / Dairy',
    'Gluten / Wheat',
    'Peanuts',
    'Tree Nuts',
    'Soy',
    'Egg',
    'Mustard',
  ];

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedDisclaimer) {
      alert('Please acknowledge the Health & Medical Disclaimer to proceed.');
      return;
    }

    const dislikes = dislikesInput
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'HealthArogyaa Member',
      email: email.trim() || undefined,
      age: Number(age) || 30,
      sex,
      heightCm: Number(heightCm) || 165,
      weightKg: Number(weightKg) || 70,
      startingWeightKg: Number(weightKg) || 70,
      targetWeightKg: Number(targetWeightKg) || 65,
      activityLevel,
      goal,
      dietPreference,
      cuisinePreference,
      likesRoti,
      likesRice,
      dislikes,
      allergies: selectedAllergies,
      dailyCalories: calorieCalcs.dailyCalories,
      proteinTargetGrams: calorieCalcs.proteinGrams,
      carbsTargetGrams: calorieCalcs.carbsGrams,
      fatTargetGrams: calorieCalcs.fatGrams,
      fibreTargetGrams: calorieCalcs.fibreGrams,
      planLevel: 'free',
    };

    onCompleteOnboarding(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step {step} of 3 · New User Induction</span>
            </div>
            <h2 className="text-xl font-bold font-display mt-0.5">
              Welcome to HealthArogyaa
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Personalizing your Indian nutrition and weight loss roadmap
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Step Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: Body Parameters */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
                1. Basic Details & Physical Measurements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="ramesh@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Biological Sex
                  </label>
                  <select
                    value={sex}
                    onChange={e => setSex(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="100"
                    value={age}
                    onChange={e => setAge(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Height (cm): <span className="text-emerald-700 font-bold">{heightInfo.feetInches}</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="230"
                    value={heightCm}
                    onChange={e => setHeightCm(parseInt(e.target.value) || 165)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="35"
                    max="220"
                    value={weightKg}
                    onChange={e => setWeightKg(parseFloat(e.target.value) || 70)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Target Goal Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="35"
                    max="220"
                    value={targetWeightKg}
                    onChange={e => setTargetWeightKg(parseFloat(e.target.value) || 65)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Instant BMI indicator */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block">Estimated BMI (Asian Indian):</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg font-extrabold text-stone-900 tabular-nums">
                      {bmiInfo.bmi}
                    </span>
                    <span className={`font-bold ${bmiInfo.categoryColor}`}>
                      ({bmiInfo.category})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-stone-500 block text-[11px]">Healthy Weight for {heightCm} cm:</span>
                  <span className="font-bold text-emerald-800 tabular-nums">
                    {bmiInfo.idealWeightRange.min} – {bmiInfo.idealWeightRange.max} kg
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Lifestyle, Diet & Allergies */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
                2. Lifestyle, Dietary Preferences & Allergies
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Daily Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={e => setActivityLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="sedentary">Sedentary (Desk job, limited exercise)</option>
                    <option value="lightly_active">Lightly Active (1-3 days brisk walk)</option>
                    <option value="moderately_active">Moderately Active (3-5 days workout)</option>
                    <option value="very_active">Very Active (6-7 days rigorous exercise)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Primary Goal
                  </label>
                  <select
                    value={goal}
                    onChange={e => setGoal(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="weight_loss">Weight Loss (500 kcal safe deficit)</option>
                    <option value="mild_weight_loss">Mild Deficit (300 kcal deficit)</option>
                    <option value="maintenance">Weight Maintenance (Balanced energy)</option>
                    <option value="muscle_gain">Muscle Tone (+300 kcal surplus)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Dietary Classification
                  </label>
                  <select
                    value={dietPreference}
                    onChange={e => setDietPreference(e.target.value as DietType)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Veg">Vegetarian (Dairy & plant foods)</option>
                    <option value="Eggetarian">Eggetarian (Veg + Eggs)</option>
                    <option value="Non-Veg">Non-Vegetarian (Chicken, Fish, Eggs)</option>
                    <option value="Vegan">Vegan (100% plant-based, no dairy)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Preferred Cuisine Style
                  </label>
                  <select
                    value={cuisinePreference}
                    onChange={e => setCuisinePreference(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pan-Indian">Pan-Indian (Mixed regional)</option>
                    <option value="North Indian">North Indian (Roti, Dal, Sabzis)</option>
                    <option value="South Indian">South Indian (Idli, Dosa, Sambar, Rice)</option>
                    <option value="Gujarati / Maharashtrian">Gujarati / Maharashtrian (Thepla, Khichdi, Poha)</option>
                  </select>
                </div>
              </div>

              {/* Grain choices */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 block">
                  Grain Preferences (HealthArogyaa never forces a fixed chart):
                </span>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={likesRoti}
                      onChange={e => setLikesRoti(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-stone-800">I enjoy Roti / Phulkas</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={likesRice}
                      onChange={e => setLikesRice(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-stone-800">I enjoy Rice &amp; Khichdi</span>
                  </label>
                </div>
              </div>

              {/* Dislikes */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Foods You Dislike / Avoid (e.g. paneer, spicy, bitter gourd):
                </label>
                <input
                  type="text"
                  placeholder="paneer, spicy"
                  value={dislikesInput}
                  onChange={e => setDislikesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Allergies / Intolerances */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Allergies &amp; Food Intolerances:
                </label>
                <div className="flex flex-wrap gap-2">
                  {allergyOptions.map(allergy => {
                    const isSelected = selectedAllergies.includes(allergy);
                    return (
                      <button
                        type="button"
                        key={allergy}
                        onClick={() => toggleAllergy(allergy)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {isSelected ? `✓ ${allergy}` : `+ ${allergy}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Summary, Calorie Target & Medical Disclaimer */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
                3. Your Calorie Requirement &amp; Medical Disclaimer
              </h3>

              {/* Calorie Output Card */}
              <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-2xl p-5 border border-stone-800 space-y-3">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                  Scientific Calorie Blueprint (Mifflin-St Jeor)
                </span>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-3xl font-extrabold text-white font-display tabular-nums">
                      {calorieCalcs.dailyCalories}
                    </span>
                    <span className="text-stone-300 text-xs ml-2 font-medium">kcal daily target</span>
                  </div>
                  <div className="text-left sm:text-right text-xs text-stone-400">
                    BMR: {calorieCalcs.bmr} kcal · TDEE: {calorieCalcs.tdee} kcal
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center pt-1 text-xs">
                  <div className="bg-stone-800/80 p-2 rounded-lg">
                    <span className="text-stone-400 text-[10px] block">Protein</span>
                    <span className="font-bold text-emerald-400">{calorieCalcs.proteinGrams}g</span>
                  </div>
                  <div className="bg-stone-800/80 p-2 rounded-lg">
                    <span className="text-stone-400 text-[10px] block">Carbs</span>
                    <span className="font-bold text-amber-300">{calorieCalcs.carbsGrams}g</span>
                  </div>
                  <div className="bg-stone-800/80 p-2 rounded-lg">
                    <span className="text-stone-400 text-[10px] block">Fats</span>
                    <span className="font-bold text-stone-200">{calorieCalcs.fatGrams}g</span>
                  </div>
                  <div className="bg-stone-800/80 p-2 rounded-lg">
                    <span className="text-stone-400 text-[10px] block">Fibre</span>
                    <span className="font-bold text-teal-300">{calorieCalcs.fibreGrams}g</span>
                  </div>
                </div>
              </div>

              {/* Profile summary recap */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <div><strong>Induction:</strong> {name || 'New Member'} · {sex}, {age} years</div>
                <div><strong>Height &amp; Weight:</strong> {heightCm} cm ({heightInfo.feetInches}) · {weightKg} kg &rarr; Goal: {targetWeightKg} kg</div>
                <div><strong>Diet &amp; Grains:</strong> {dietPreference} ({likesRoti ? 'Likes Roti' : 'No Roti'}, {likesRice ? 'Rice' : 'No Rice'})</div>
                {dislikesInput && <div className="text-amber-800"><strong>Dislikes:</strong> {dislikesInput}</div>}
                {selectedAllergies.length > 0 && <div className="text-rose-700"><strong>Allergies:</strong> {selectedAllergies.join(', ')}</div>}
              </div>

              {/* Certified Dietician Guidance & Health Agreement */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <span className="text-sm">🌿</span>
                  <span>Certified Dietician Guidance &amp; Agreement</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  HealthArogyaa provides science-backed Indian nutrition and habit coaching founded by a Certified Dietician. <strong>Wellness guidance complements, but does not replace, diagnosis or treatment from your doctor. Individual results vary.</strong>
                </p>

                <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedDisclaimer}
                    onChange={e => setAcceptedDisclaimer(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-stone-900">
                    I understand that wellness guidance complements, but does not replace, care from my doctor.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!acceptedDisclaimer}
              onClick={handleFinish}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Complete Induction &amp; Start Today</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

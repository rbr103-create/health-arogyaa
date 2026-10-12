import { UserProfile } from '../types';

export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  categoryColor: string;
  idealWeightRange: { min: number; max: number };
  healthSummary: string;
}

export function calculateBMI(weightKg: number, heightCm: number): BmiResult {
  if (heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 22,
      category: 'Normal',
      categoryColor: 'text-emerald-700',
      idealWeightRange: { min: 55, max: 70 },
      healthSummary: 'Healthy body mass index',
    };
  }

  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  // Ideal weight range based on normal BMI (18.5 - 22.9 for Asian Indian context)
  const minWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxWeight = Math.round(22.9 * heightM * heightM * 10) / 10;

  if (bmi < 18.5) {
    return {
      bmi,
      category: 'Underweight',
      categoryColor: 'text-amber-700',
      idealWeightRange: { min: minWeight, max: maxWeight },
      healthSummary: 'Below optimal range. Focus on nutrient-dense calorie additions.',
    };
  } else if (bmi <= 22.9) {
    return {
      bmi,
      category: 'Normal',
      categoryColor: 'text-emerald-700',
      idealWeightRange: { min: minWeight, max: maxWeight },
      healthSummary: 'Optimal health zone. Aim to maintain this range with steady activity.',
    };
  } else if (bmi <= 24.9) {
    return {
      bmi,
      category: 'Overweight',
      categoryColor: 'text-amber-700',
      idealWeightRange: { min: minWeight, max: maxWeight },
      healthSummary: 'Slightly above Asian Indian optimal threshold. A mild calorie deficit is recommended.',
    };
  } else {
    return {
      bmi,
      category: 'Obese',
      categoryColor: 'text-rose-700',
      idealWeightRange: { min: minWeight, max: maxWeight },
      healthSummary: 'Above recommended clinical range. Sustainable meal choices will yield gradual weight reduction.',
    };
  }
}

export function calculateBMR(sex: 'Male' | 'Female', weightKg: number, heightCm: number, age: number): number {
  if (sex === 'Male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

export function calculateTDEE(bmr: number, activityLevel: UserProfile['activityLevel']): number {
  const multipliers: Record<UserProfile['activityLevel'], number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

export function calculateDailyCalorieTarget(
  sex: 'Male' | 'Female',
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: UserProfile['activityLevel'],
  goal: UserProfile['goal']
): { dailyCalories: number; bmr: number; tdee: number; proteinGrams: number; carbsGrams: number; fatGrams: number; fibreGrams: number } {
  const bmr = calculateBMR(sex, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);

  let target = tdee;
  if (goal === 'weight_loss') {
    target = tdee - 500;
  } else if (goal === 'mild_weight_loss') {
    target = tdee - 300;
  } else if (goal === 'muscle_gain') {
    target = tdee + 300;
  }

  // Safety threshold floors
  const minAllowed = sex === 'Male' ? 1500 : 1200;
  if (target < minAllowed) {
    target = minAllowed;
  }

  // Balanced macro split for sustainable Indian weight loss:
  // 25% Protein, 48% Carbohydrates (complex & low GI), 27% Healthy Fats
  const proteinKcal = target * 0.25;
  const carbsKcal = target * 0.48;
  const fatKcal = target * 0.27;

  const proteinGrams = Math.round(proteinKcal / 4);
  const carbsGrams = Math.round(carbsKcal / 4);
  const fatGrams = Math.round(fatKcal / 9);
  const fibreGrams = 32;

  return {
    dailyCalories: target,
    bmr,
    tdee,
    proteinGrams,
    carbsGrams,
    fatGrams,
    fibreGrams,
  };
}

export function formatHeight(heightCm: number): { cm: number; formatted: string; feetInches: string } {
  if (!heightCm || heightCm <= 0) {
    return { cm: 0, formatted: '0 cm', feetInches: '0\' 0"' };
  }
  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return {
    cm: heightCm,
    formatted: `${heightCm} cm (${feet}' ${inches}")`,
    feetInches: `${feet}' ${inches}"`,
  };
}

export function calculateMilestoneProgress(startingWeightKg: number, currentWeightKg: number) {
  const diff = startingWeightKg - currentWeightKg;
  const percentChange = startingWeightKg > 0 ? (diff / startingWeightKg) * 100 : 0;
  const roundedPercent = Math.max(0, Math.round(percentChange * 10) / 10);

  // Milestones at 1%, 2%, 3%, 5%, 8%, 10%
  const milestoneThresholds = [1, 2, 3, 5, 8, 10];
  const achievedThreshold = milestoneThresholds.slice().reverse().find(t => roundedPercent >= t);

  return {
    isLoss: diff > 0,
    lostKg: Math.abs(Math.round(diff * 10) / 10),
    percentChange: roundedPercent,
    highestMilestone: achievedThreshold || null,
    qualifiesForFreeMonth: roundedPercent >= 5.0,
  };
}

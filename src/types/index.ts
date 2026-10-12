export type MealCategory = 'Breakfast' | 'PreLunch' | 'Lunch' | 'Dinner' | 'Snacks' | 'Beverages' | 'Accompaniments';

export type DietType = 'Veg' | 'Eggetarian' | 'Non-Veg' | 'Vegan';

export type GICategory = 'Low' | 'Medium' | 'High';

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  category: MealCategory;
  isCombo: boolean;
  vegetarian: boolean;
  dietType: DietType;
  serving: string;
  baseServingCount: number;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fibre: number; // in grams
  sugar: number; // in grams
  gi: GICategory;
  gl: number;
  tags: string[]; // e.g., 'High Protein', 'No Paneer', 'Roti', 'Rice', 'Weight Loss Friendly'
  active: boolean;
  swapAlternativeIds?: string[];
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female';
  heightCm: number;
  weightKg: number;
  startingWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  goal: 'weight_loss' | 'mild_weight_loss' | 'maintenance' | 'muscle_gain';
  dietPreference: DietType;
  cuisinePreference: string;
  likesRoti: boolean;
  likesRice: boolean;
  dislikes: string[]; // e.g. ['paneer', 'dairy', 'spicy']
  allergies: string[]; // e.g. ['Lactose / Dairy', 'Gluten', 'Nuts', 'Soy']
  foodPreferences?: string[]; // e.g. ['Home-cooked', 'High Protein', 'South Indian', 'Low Oil']
  email?: string;
  dailyCalories: number;
  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;
  fibreTargetGrams: number;
  planLevel: 'free' | 'premium';
  premiumExpiresAt?: string;
  freeScansUsed?: number; // 3 free scans for free plan, unlimited for premium
  medicalDisclaimerAccepted?: boolean;
  monthlyReviewTokensRemaining?: number;
  lastDieticianFeedback?: {
    date: string;
    dieticianName: string;
    note: string;
    actionSteps: string[];
  };
}

export type PlanTier = '1_month' | '3_months' | '6_months';

export interface PlanBundleOption {
  id: PlanTier;
  title: string;
  tagline: string;
  months: number;
  price: number;
  originalPrice: number;
  savings: number;
  popular?: boolean;
  bestValue?: boolean;
  badge?: string;
  perMonthPrice: number;
  features: string[];
}

export interface SeasonalDrop {
  id: string;
  title: string;
  seasonName: string;
  tagline: string;
  bannerEmoji: string;
  themeColor: string;
  keyBenefits: string[];
  recommendedFoods: {
    name: string;
    portion: string;
    calories: number;
    benefits: string;
  }[];
  swaps: {
    avoid: string;
    choose: string;
    reason: string;
  }[];
  lifestyleTip: string;
}

export interface LoggedMealItem {
  instanceId: string;
  foodId: string;
  name: string;
  category: MealCategory;
  serving: string;
  portionMultiplier: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  sugar: number;
  gi: GICategory;
  gl: number;
  vegetarian: boolean;
  loggedAt: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  breakfast: LoggedMealItem[];
  preLunch: LoggedMealItem[];
  lunch: LoggedMealItem[];
  dinner: LoggedMealItem[];
  snacks: LoggedMealItem[];
  waterIntakeLiters: number;
}

export interface WeightRecord {
  id: string;
  date: string;
  weightKg: number;
  notes?: string;
}

export interface MilestoneReward {
  id: string;
  achievedDate: string;
  startingWeightKg: number;
  currentWeightKg: number;
  percentageLost: number;
  claimed: boolean;
  rewardDescription: string;
}

export interface ExpertReviewRequest {
  id: string;
  userId: string;
  userName: string;
  date: string;
  reviewType: 'Food Choices' | 'Daily Meal Pattern' | 'Weight Management Progress' | 'Food Diary Review';
  userNotes: string;
  amountPaid: number;
  status: 'Pending' | 'Under Review' | 'Completed';
  expertFeedback?: string;
  reviewedDate?: string;
}

export interface ConsultationBooking {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  date: string;
  timeSlot: string;
  durationMinutes: 30;
  goal: string;
  currentWeightKg: number;
  startingWeightKg: number;
  dailyTargetCalories: number;
  amountPaid: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  expertNotes?: string;
}

export interface SubscriptionPayment {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  amount: number; // 199
  planDurationMonths: number;
  paymentMethod: 'UPI';
  upiTransactionId: string; // 12-digit UTR
  screenshotUrl?: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedAt?: string;
  adminNotes?: string;
}

export interface UpiPaymentSettings {
  payeeVpa: string;
  payeeName: string;
  qrCodeImageUrl?: string;
  autoGrantProvisional: boolean;
}

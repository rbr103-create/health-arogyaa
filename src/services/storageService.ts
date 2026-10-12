import {
  FoodItem,
  UserProfile,
  DailyLog,
  WeightRecord,
  MilestoneReward,
  ExpertReviewRequest,
  ConsultationBooking,
  LoggedMealItem,
  MealCategory,
  SubscriptionPayment,
  UpiPaymentSettings,
} from '../types';
import { INITIAL_FOOD_DATABASE } from '../data/seedFoods';
import { PRESET_USERS } from '../data/mockUsers';

const FOODS_KEY = 'healtharogyaa_foods_v1';
const USERS_KEY = 'healtharogyaa_users_v1';
const ACTIVE_USER_ID_KEY = 'healtharogyaa_active_user_id_v1';
const DAILY_LOGS_KEY = 'healtharogyaa_daily_logs_v1';
const WEIGHT_RECORDS_KEY = 'healtharogyaa_weight_records_v1';
const MILESTONE_REWARDS_KEY = 'healtharogyaa_milestone_rewards_v1';
const EXPERT_REVIEWS_KEY = 'healtharogyaa_expert_reviews_v1';
const CONSULTATIONS_KEY = 'healtharogyaa_consultations_v1';
const SUBSCRIPTIONS_KEY = 'healtharogyaa_subscriptions_v1';
const UPI_SETTINGS_KEY = 'healtharogyaa_upi_settings_v1';

// Seed initial foods with automatic sync for new catalog items
export function getFoods(): FoodItem[] {
  try {
    const raw = localStorage.getItem(FOODS_KEY);
    if (!raw) {
      localStorage.setItem(FOODS_KEY, JSON.stringify(INITIAL_FOOD_DATABASE));
      return INITIAL_FOOD_DATABASE;
    }
    const stored: FoodItem[] = JSON.parse(raw);
    // If new foods were added to INITIAL_FOOD_DATABASE, merge them seamlessly
    const existingIds = new Set(stored.map(f => f.id));
    const missingItems = INITIAL_FOOD_DATABASE.filter(f => !existingIds.has(f.id));
    if (missingItems.length > 0) {
      const merged = [...stored, ...missingItems];
      localStorage.setItem(FOODS_KEY, JSON.stringify(merged));
      return merged;
    }
    return stored;
  } catch (e) {
    return INITIAL_FOOD_DATABASE;
  }
}

export function saveFoods(foods: FoodItem[]): void {
  localStorage.setItem(FOODS_KEY, JSON.stringify(foods));
}

export function addFood(food: FoodItem): void {
  const current = getFoods();
  current.unshift(food);
  saveFoods(current);
}

export function updateFood(food: FoodItem): void {
  const current = getFoods();
  const index = current.findIndex(f => f.id === food.id);
  if (index !== -1) {
    current[index] = food;
    saveFoods(current);
  }
}

export function deleteFood(id: string): void {
  const current = getFoods().filter(f => f.id !== id);
  saveFoods(current);
}

export function resetFoodsToDefault(): void {
  localStorage.setItem(FOODS_KEY, JSON.stringify(INITIAL_FOOD_DATABASE));
}

// User Profiles
export function getAllUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(PRESET_USERS));
      return PRESET_USERS;
    }
    const parsed: UserProfile[] = JSON.parse(raw);
    let changed = false;
    const sanitized = parsed.map(u => {
      if (
        u.lastDieticianFeedback &&
        (!u.lastDieticianFeedback.dieticianName ||
          u.lastDieticianFeedback.dieticianName.includes('Ananya') ||
          !u.lastDieticianFeedback.dieticianName.includes('Ravi Sushil Bhargav'))
      ) {
        changed = true;
        return {
          ...u,
          lastDieticianFeedback: {
            ...u.lastDieticianFeedback,
            dieticianName: 'Ravi Sushil Bhargav (Clinical Dietitian)',
          },
        };
      }
      return u;
    });
    if (changed) {
      localStorage.setItem(USERS_KEY, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch {
    return PRESET_USERS;
  }
}

export function saveUsers(users: UserProfile[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getActiveUser(): UserProfile {
  const users = getAllUsers();
  const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY) || 'user-a';
  const found = users.find(u => u.id === activeId);
  return found || users[0] || PRESET_USERS[0];
}

export function setActiveUserId(id: string): void {
  localStorage.setItem(ACTIVE_USER_ID_KEY, id);
}

export function updateUserProfile(updated: UserProfile): void {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === updated.id);
  if (index !== -1) {
    users[index] = updated;
  } else {
    users.push(updated);
  }
  saveUsers(users);
}

// Daily Logs
export function getDailyLog(dateStr: string): DailyLog {
  const allLogs: Record<string, DailyLog> = JSON.parse(localStorage.getItem(DAILY_LOGS_KEY) || '{}');
  if (allLogs[dateStr]) {
    const existing = allLogs[dateStr];
    if (!existing.preLunch) existing.preLunch = [];
    return existing;
  }
  const empty: DailyLog = {
    date: dateStr,
    breakfast: [],
    preLunch: [],
    lunch: [],
    dinner: [],
    snacks: [],
    waterIntakeLiters: 1.5,
  };
  return empty;
}

export function saveDailyLog(log: DailyLog): void {
  const allLogs: Record<string, DailyLog> = JSON.parse(localStorage.getItem(DAILY_LOGS_KEY) || '{}');
  allLogs[log.date] = log;
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(allLogs));
}

// 15-Day Calorie Calendar History
export interface DayCalorieSummary {
  date: string;
  dayOfWeek: string;
  formattedDate: string;
  isToday: boolean;
  targetCalories: number;
  consumedCalories: number;
  remainingCalories: number;
  adherence: 'on_track' | 'deficit' | 'surplus';
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  mealsCount: number;
  log: DailyLog;
}

export function getLast15DaysHistory(user: UserProfile): DayCalorieSummary[] {
  const allLogs: Record<string, DailyLog> = JSON.parse(localStorage.getItem(DAILY_LOGS_KEY) || '{}');
  const result: DayCalorieSummary[] = [];
  const today = new Date();

  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isToday = i === 0;

    let log = allLogs[dateStr];

    if (!log) {
      if (isToday) {
        log = {
          date: dateStr,
          breakfast: [],
          preLunch: [],
          lunch: [],
          dinner: [],
          snacks: [],
          waterIntakeLiters: 1.5,
        };
      } else {
        // Generate realistic historical Indian meal log for user calibration
        const varianceFactor = 0.92 + ((i * 3) % 15) / 100; // 92% to 106%
        const dayKcal = Math.round(user.dailyCalories * varianceFactor);
        const bfKcal = Math.round(dayKcal * 0.25);
        const plKcal = 65;
        const lnKcal = Math.round(dayKcal * 0.35);
        const dnKcal = Math.round(dayKcal * 0.27);
        const snKcal = Math.max(50, dayKcal - bfKcal - plKcal - lnKcal - dnKcal);

        log = {
          date: dateStr,
          breakfast: [
            {
              instanceId: `hist-bf-${i}`,
              foodId: 'BF001',
              name: user.likesRoti ? 'Besan Chilla with Mint Chutney' : 'Vegetable Poha with Peanuts',
              category: 'Breakfast',
              serving: '2 medium chillas',
              portionMultiplier: 1,
              calories: bfKcal,
              protein: Math.round(bfKcal * 0.05),
              carbs: Math.round(bfKcal * 0.12),
              fat: Math.round(bfKcal * 0.03),
              fibre: 6,
              sugar: 2,
              gi: 'Low',
              gl: 9,
              vegetarian: true,
              loggedAt: '08:30 AM',
            },
          ],
          preLunch: [
            {
              instanceId: `hist-pl-${i}`,
              foodId: 'PL001',
              name: 'Pre-Lunch Seasonal Fruit & Salad Bowl',
              category: 'PreLunch',
              serving: '1 bowl fresh salad & fruits',
              portionMultiplier: 1,
              calories: plKcal,
              protein: 1.5,
              carbs: 15,
              fat: 0.2,
              fibre: 4.5,
              sugar: 9,
              gi: 'Low',
              gl: 4,
              vegetarian: true,
              loggedAt: '12:45 PM',
            },
          ],
          lunch: [
            {
              instanceId: `hist-ln-${i}`,
              foodId: 'LN001',
              name: user.dietPreference === 'Non-Veg' ? 'Chicken Curry + 2 Roti + Salad' : 'Yellow Moong Dal + 2 Roti + Sabzi',
              category: 'Lunch',
              serving: '1 standard thali portion',
              portionMultiplier: 1,
              calories: lnKcal,
              protein: Math.round(lnKcal * 0.04),
              carbs: Math.round(lnKcal * 0.14),
              fat: Math.round(lnKcal * 0.025),
              fibre: 11,
              sugar: 4,
              gi: 'Low',
              gl: 14,
              vegetarian: user.dietPreference !== 'Non-Veg',
              loggedAt: '01:15 PM',
            },
          ],
          dinner: [
            {
              instanceId: `hist-dn-${i}`,
              foodId: 'DN001',
              name: 'Moong Dal Khichdi + Chaas',
              category: 'Dinner',
              serving: '1 bowl khichdi + buttermilk',
              portionMultiplier: 1,
              calories: dnKcal,
              protein: Math.round(dnKcal * 0.038),
              carbs: Math.round(dnKcal * 0.15),
              fat: Math.round(dnKcal * 0.02),
              fibre: 8,
              sugar: 3,
              gi: 'Low',
              gl: 11,
              vegetarian: true,
              loggedAt: '08:00 PM',
            },
          ],
          snacks: [
            {
              instanceId: `hist-sn-${i}`,
              foodId: 'SN001',
              name: 'Roasted Spiced Makhana + Green Tea',
              category: 'Snacks',
              serving: '1 bowl makhana (35g)',
              portionMultiplier: 1,
              calories: snKcal,
              protein: 4,
              carbs: 22,
              fat: 3,
              fibre: 4,
              sugar: 0,
              gi: 'Low',
              gl: 4,
              vegetarian: true,
              loggedAt: '05:00 PM',
            },
          ],
          waterIntakeLiters: 2.25,
        };
        allLogs[dateStr] = log;
      }
    }

    const allItems = [
      ...log.breakfast,
      ...(log.preLunch || []),
      ...log.lunch,
      ...log.dinner,
      ...log.snacks,
    ];
    const consumed = allItems.reduce((acc, c) => acc + c.calories, 0);
    const diff = consumed - user.dailyCalories;

    let adherence: 'on_track' | 'deficit' | 'surplus' = 'on_track';
    if (Math.abs(diff) <= 120) {
      adherence = 'on_track';
    } else if (diff < -120) {
      adherence = 'deficit';
    } else {
      adherence = 'surplus';
    }

    result.push({
      date: dateStr,
      dayOfWeek,
      formattedDate,
      isToday,
      targetCalories: user.dailyCalories,
      consumedCalories: consumed,
      remainingCalories: Math.max(0, user.dailyCalories - consumed),
      adherence,
      protein: Math.round(allItems.reduce((a, c) => a + c.protein, 0)),
      carbs: Math.round(allItems.reduce((a, c) => a + c.carbs, 0)),
      fat: Math.round(allItems.reduce((a, c) => a + c.fat, 0)),
      fibre: Math.round(allItems.reduce((a, c) => a + c.fibre, 0)),
      mealsCount: allItems.length,
      log,
    });
  }

  // Persist any backfilled history
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(allLogs));
  return result;
}

export function logMealItem(
  dateStr: string,
  slot: 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks',
  item: LoggedMealItem
): DailyLog {
  const log = getDailyLog(dateStr);
  if (!log[slot]) log[slot] = [];
  log[slot].push(item);
  saveDailyLog(log);
  return log;
}

export function removeMealItem(
  dateStr: string,
  slot: 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks',
  instanceId: string
): DailyLog {
  const log = getDailyLog(dateStr);
  if (log[slot]) {
    log[slot] = log[slot].filter(item => item.instanceId !== instanceId);
    saveDailyLog(log);
  }
  return log;
}

export function updateMealItemPortion(
  dateStr: string,
  slot: 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks',
  instanceId: string,
  newMultiplier: number,
  baseFood: FoodItem
): DailyLog {
  const log = getDailyLog(dateStr);
  if (!log[slot]) log[slot] = [];
  const item = log[slot].find(i => i.instanceId === instanceId);
  if (item) {
    item.portionMultiplier = newMultiplier;
    item.calories = Math.round(baseFood.calories * newMultiplier);
    item.protein = Math.round(baseFood.protein * newMultiplier * 10) / 10;
    item.carbs = Math.round(baseFood.carbs * newMultiplier * 10) / 10;
    item.fat = Math.round(baseFood.fat * newMultiplier * 10) / 10;
    item.fibre = Math.round(baseFood.fibre * newMultiplier * 10) / 10;
    item.gl = Math.round(baseFood.gl * newMultiplier * 10) / 10;
    saveDailyLog(log);
  }
  return log;
}

// Weight Records
export function getWeightRecords(userId: string): WeightRecord[] {
  try {
    const raw = localStorage.getItem(`${WEIGHT_RECORDS_KEY}_${userId}`);
    if (!raw) {
      // Seed default record from user starting weight
      const active = getActiveUser();
      const initial: WeightRecord[] = [
        {
          id: 'w-init',
          date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
          weightKg: active.startingWeightKg,
          notes: 'Starting journey weight'
        },
      ];
      localStorage.setItem(`${WEIGHT_RECORDS_KEY}_${userId}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addWeightRecord(userId: string, weightKg: number, notes?: string): WeightRecord[] {
  const records = getWeightRecords(userId);
  const today = new Date().toISOString().split('T')[0];
  const newRecord: WeightRecord = {
    id: `w-${Date.now()}`,
    date: today,
    weightKg,
    notes,
  };
  records.push(newRecord);
  localStorage.setItem(`${WEIGHT_RECORDS_KEY}_${userId}`, JSON.stringify(records));
  return records;
}

// Milestone Rewards
export function getMilestoneRewards(userId: string): MilestoneReward[] {
  try {
    const raw = localStorage.getItem(`${MILESTONE_REWARDS_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMilestoneReward(userId: string, reward: MilestoneReward): void {
  const current = getMilestoneRewards(userId);
  current.push(reward);
  localStorage.setItem(`${MILESTONE_REWARDS_KEY}_${userId}`, JSON.stringify(current));
}

// Expert Reviews
export function getExpertReviews(): ExpertReviewRequest[] {
  try {
    const raw = localStorage.getItem(EXPERT_REVIEWS_KEY);
    if (!raw) {
      const initial: ExpertReviewRequest[] = [
        {
          id: 'rev-001',
          userId: 'user-a',
          userName: 'Rajesh Sharma',
          date: '2026-09-30',
          reviewType: 'Food Diary Review',
          userNotes: 'I am trying to reduce 10 kg without giving up my daily rotis. Please verify my lunch portion and evening snack routine.',
          amountPaid: 499,
          status: 'Under Review',
          expertFeedback: 'Great consistency on Moong Dal and Besan Chilla! For lunch, keeping rotis to exactly 2 phulkas with 1 large katori dal and generous cucumber salad gives the ideal fibre-to-carb ratio. Replace evening tea biscuits with roasted makhana.',
          reviewedDate: '2026-10-01',
        },
      ];
      localStorage.setItem(EXPERT_REVIEWS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveExpertReviews(reviews: ExpertReviewRequest[]): void {
  localStorage.setItem(EXPERT_REVIEWS_KEY, JSON.stringify(reviews));
}

export function addExpertReview(req: Omit<ExpertReviewRequest, 'id' | 'status'>): ExpertReviewRequest {
  const reviews = getExpertReviews();
  const newRev: ExpertReviewRequest = {
    ...req,
    id: `rev-${Date.now()}`,
    status: 'Pending',
  };
  reviews.unshift(newRev);
  saveExpertReviews(reviews);
  return newRev;
}

export function updateExpertReviewStatus(id: string, status: ExpertReviewRequest['status'], feedback?: string): void {
  const reviews = getExpertReviews();
  const item = reviews.find(r => r.id === id);
  if (item) {
    item.status = status;
    if (feedback !== undefined) item.expertFeedback = feedback;
    item.reviewedDate = new Date().toISOString().split('T')[0];
    saveExpertReviews(reviews);
  }
}

// Consultations
export function getConsultations(): ConsultationBooking[] {
  try {
    const raw = localStorage.getItem(CONSULTATIONS_KEY);
    if (!raw) {
      const initial: ConsultationBooking[] = [
        {
          id: 'con-001',
          userId: 'user-a',
          userName: 'Rajesh Sharma',
          date: '2026-10-05',
          timeSlot: '11:00 AM - 11:30 AM',
          durationMinutes: 30,
          goal: 'Weight Loss & Metabolic Health',
          currentWeightKg: 85.0,
          startingWeightKg: 85.0,
          dailyTargetCalories: 1900,
          amountPaid: 1499,
          status: 'Confirmed',
        },
      ];
      localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveConsultations(consultations: ConsultationBooking[]): void {
  localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations));
}

export function addConsultation(booking: Omit<ConsultationBooking, 'id' | 'status'>): ConsultationBooking {
  const list = getConsultations();
  const created: ConsultationBooking = {
    ...booking,
    id: `con-${Date.now()}`,
    status: 'Confirmed',
  };
  list.unshift(created);
  saveConsultations(list);
  return created;
}

export function updateConsultationStatus(id: string, status: ConsultationBooking['status'], expertNotes?: string): void {
  const list = getConsultations();
  const item = list.find(c => c.id === id);
  if (item) {
    item.status = status;
    if (expertNotes !== undefined) item.expertNotes = expertNotes;
    saveConsultations(list);
  }
}

// Subscriptions & UPI Payments
export function getSubscriptions(): SubscriptionPayment[] {
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_KEY);
    if (!raw) {
      const initial: SubscriptionPayment[] = [
        {
          id: 'sub-001',
          userId: 'user-a',
          userName: 'Rajesh Sharma',
          userPhone: '+91 98765 43210',
          amount: 199,
          planDurationMonths: 1,
          paymentMethod: 'UPI',
          upiTransactionId: '427189012345',
          submittedAt: '2026-10-01T10:15:00.000Z',
          status: 'Approved',
          approvedAt: '2026-10-01T10:30:00.000Z',
          adminNotes: 'Verified via Bank SMS',
        },
      ];
      localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSubscriptions(subscriptions: SubscriptionPayment[]): void {
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
}

export function addSubscriptionPayment(
  payment: Omit<SubscriptionPayment, 'id' | 'status' | 'submittedAt'>
): SubscriptionPayment {
  const list = getSubscriptions();
  const created: SubscriptionPayment = {
    ...payment,
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'Pending',
  };
  list.unshift(created);
  saveSubscriptions(list);
  return created;
}

export function updateSubscriptionStatus(
  id: string,
  status: SubscriptionPayment['status'],
  adminNotes?: string
): void {
  const list = getSubscriptions();
  const item = list.find(s => s.id === id);
  if (item) {
    item.status = status;
    if (status === 'Approved') {
      item.approvedAt = new Date().toISOString();
    }
    if (adminNotes !== undefined) item.adminNotes = adminNotes;
    saveSubscriptions(list);
  }
}

// UPI Payment Configuration Settings
export const DEFAULT_UPI_SETTINGS: UpiPaymentSettings = {
  payeeVpa: 'healtharogyaa@upi',
  payeeName: 'HealthArogyaa Wellness',
  autoGrantProvisional: true,
};

export function getUpiPaymentSettings(): UpiPaymentSettings {
  try {
    const raw = localStorage.getItem(UPI_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(UPI_SETTINGS_KEY, JSON.stringify(DEFAULT_UPI_SETTINGS));
      return DEFAULT_UPI_SETTINGS;
    }
    return { ...DEFAULT_UPI_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_UPI_SETTINGS;
  }
}

export function saveUpiPaymentSettings(settings: UpiPaymentSettings): void {
  localStorage.setItem(UPI_SETTINGS_KEY, JSON.stringify(settings));
}

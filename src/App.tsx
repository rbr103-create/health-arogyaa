import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  FoodItem,
  DailyLog,
  WeightRecord,
  ExpertReviewRequest,
  ConsultationBooking,
  MealCategory,
  LoggedMealItem,
  SubscriptionPayment,
  UpiPaymentSettings,
} from './types';
import {
  getFoods,
  saveFoods,
  addFood,
  updateFood,
  deleteFood,
  resetFoodsToDefault,
  getAllUsers,
  getActiveUser,
  setActiveUserId,
  updateUserProfile,
  deleteUserProfile,
  resetToBrandNewTester,
  getDailyLog,
  saveDailyLog,
  logMealItem,
  removeMealItem,
  updateMealItemPortion,
  getWeightRecords,
  addWeightRecord,
  saveMilestoneReward,
  getExpertReviews,
  addExpertReview,
  updateExpertReviewStatus,
  getConsultations,
  addConsultation,
  updateConsultationStatus,
  getSubscriptions,
  addSubscriptionPayment,
  updateSubscriptionStatus,
  getUpiPaymentSettings,
  saveUpiPaymentSettings,
} from './services/storageService';

import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DailyDashboard } from './components/dashboard/DailyDashboard';
import { MealSelectionModal } from './components/meals/MealSelectionModal';
import { FoodScannerModal } from './components/scanner/FoodScannerModal';
import { WeightTrackerModal } from './components/weight/WeightTrackerModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { ExpertServicesModal } from './components/expert/ExpertServicesModal';
import { AiNutritionAssistant } from './components/ai/AiNutritionAssistant';
import { AdminPanel } from './components/admin/AdminPanel';
import { MobileTestModal } from './components/common/MobileTestModal';
import { FifteenDayCalendarModal } from './components/calendar/FifteenDayCalendarModal';
import { PremiumPlanModal } from './components/premium/PremiumPlanModal';
import { UserOnboardingModal } from './components/onboarding/UserOnboardingModal';
import { MethodologyModal } from './components/common/MethodologyModal';
import { NutritionAccuracyModal } from './components/common/NutritionAccuracyModal';
import { MedicalDisclaimerModal } from './components/common/MedicalDisclaimerModal';
import { AdminPasscodeModal } from './components/admin/AdminPasscodeModal';
import { SeasonalDropsModal } from './components/common/SeasonalDropsModal';
import { InstallPwaBanner } from './components/common/InstallPwaBanner';
import { calculateDailyCalorieTarget } from './utils/nutritionCalculators';

// Helper to detect admin mode from URL parameters (?mode=admin or ?admin=true)
function checkIsDirectAdmin(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('mode') === 'admin' ||
      params.get('admin') === 'true' ||
      window.location.hash.toLowerCase().includes('admin') ||
      window.location.pathname.endsWith('/admin')
    ) {
      return true;
    }
    // Clean up any stale legacy admin mode so normal patients are never locked into admin
    if (localStorage.getItem('healtharogyaa_app_mode') === 'admin') {
      localStorage.removeItem('healtharogyaa_app_mode');
    }
  } catch {
    return false;
  }
  return false;
}

function getInitialAdminTab(): 'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions' {
  try {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (
      tabParam &&
      ['foods', 'reviews', 'consultations', 'users', 'methodology', 'subscriptions'].includes(tabParam)
    ) {
      return tabParam as any;
    }
  } catch {}
  return 'foods';
}

export default function App() {
  // Global App States - initialized synchronously from URL for instant admin routing
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => checkIsDirectAdmin());
  const [isAdminPasscodeModalOpen, setIsAdminPasscodeModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => checkIsDirectAdmin());
  const [adminTab, setAdminTab] = useState<'foods' | 'reviews' | 'consultations' | 'users' | 'methodology' | 'subscriptions'>(() => getInitialAdminTab());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Entities (synchronous initialization so no flash or blank screen)
  const [allFoods, setAllFoods] = useState<FoodItem[]>(() => getFoods());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => getAllUsers());
  const [activeUser, setActiveUser] = useState<UserProfile>(() => getActiveUser());
  const [dailyLog, setDailyLog] = useState<DailyLog>(() =>
    getDailyLog(new Date().toISOString().split('T')[0])
  );
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    const user = getActiveUser();
    return user ? getWeightRecords(user.id) : [];
  });
  const [expertReviews, setExpertReviews] = useState<ExpertReviewRequest[]>(() => getExpertReviews());
  const [consultations, setConsultations] = useState<ConsultationBooking[]>(() => getConsultations());
  const [subscriptions, setSubscriptions] = useState<SubscriptionPayment[]>(() => getSubscriptions());
  const [upiSettings, setUpiSettings] = useState<UpiPaymentSettings>(() => getUpiPaymentSettings());

  // Modals
  const [selectedMealCategory, setSelectedMealCategory] = useState<MealCategory | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [isMobileTestModalOpen, setIsMobileTestModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarTargetUser, setCalendarTargetUser] = useState<UserProfile | null>(null);
  const [isAdminCalendarView, setIsAdminCalendarView] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [isNutritionAccuracyModalOpen, setIsNutritionAccuracyModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isSeasonalDropsModalOpen, setIsSeasonalDropsModalOpen] = useState(false);
  const [sharedSearchQuery, setSharedSearchQuery] = useState<string>('');

  // Initialization from storage & URL Routing for client vs admin links
  useEffect(() => {
    // Check if directly loaded with admin link (?mode=admin, ?admin=true, #admin)
    try {
      const params = new URLSearchParams(window.location.search);
      const isDirectAdmin =
        params.get('mode') === 'admin' ||
        params.get('admin') === 'true' ||
        window.location.hash.toLowerCase().includes('admin') ||
        window.location.pathname.endsWith('/admin');

      if (isDirectAdmin) {
        setIsAdminMode(true);
        setIsAdminAuthenticated(true);
      } else {
        const sharedTitle = params.get('title') || '';
        const sharedText = params.get('text') || '';
        const sharedUrl = params.get('url') || '';
        const combined = [sharedTitle, sharedText, sharedUrl].filter(Boolean).join(' ').trim();
        if (combined) {
          setSharedSearchQuery(combined);
          setSelectedMealCategory('Lunch');
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete('title');
          cleanUrl.searchParams.delete('text');
          cleanUrl.searchParams.delete('url');
          window.history.replaceState({}, '', cleanUrl.toString());
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }

    const loadedFoods = getFoods();
    const loadedUsers = getAllUsers();
    const currentActive = getActiveUser();
    const currentReviews = getExpertReviews();
    const currentConsultations = getConsultations();

    if (currentActive && currentActive.lastDieticianFeedback) {
      if (
        !currentActive.lastDieticianFeedback.dieticianName ||
        currentActive.lastDieticianFeedback.dieticianName.includes('Ananya') ||
        !currentActive.lastDieticianFeedback.dieticianName.includes('Ravi Sushil Bhargav')
      ) {
        currentActive.lastDieticianFeedback.dieticianName = 'Ravi Sushil Bhargav (Clinical Dietitian)';
        updateUserProfile(currentActive);
      }
    }

    setAllFoods(loadedFoods);
    setAllUsers(loadedUsers);
    setActiveUser({ ...currentActive });
    setExpertReviews(currentReviews);
    setConsultations(currentConsultations);

    if (currentActive) {
      setDailyLog(getDailyLog(selectedDate));
      setWeightRecords(getWeightRecords(currentActive.id));
    }

    // Trigger onboarding for any brand new client download on first launch
    const hasCompletedOnboarding = localStorage.getItem('healtharogyaa_onboarding_completed_v1') === 'true';
    const isDefaultNewClient = currentActive.id === 'client-user' || currentActive.name === 'New Member';
    if ((!hasCompletedOnboarding || isDefaultNewClient) && !checkIsDirectAdmin()) {
      setIsOnboardingModalOpen(true);
    }
  }, []);

  // Listen for browser navigation (e.g. back/forward, URL parameter changes)
  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsDirectAdmin()) {
        setIsAdminMode(true);
        setIsAdminAuthenticated(true);
        const t = getInitialAdminTab();
        if (t) setAdminTab(t);
      } else {
        setIsAdminMode(false);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Sync browser URL with current mode (client vs admin)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (isAdminMode) {
        url.searchParams.set('mode', 'admin');
        if (adminTab) {
          url.searchParams.set('tab', adminTab);
        }
        window.history.replaceState({}, '', url.toString());
      } else {
        if (url.searchParams.has('mode') || url.searchParams.has('admin') || url.searchParams.has('tab')) {
          url.searchParams.delete('mode');
          url.searchParams.delete('admin');
          url.searchParams.delete('tab');
          if (url.hash.includes('admin')) url.hash = '';
          window.history.replaceState({}, '', url.toString());
        }
      }
    } catch (e) {
      // Ignore
    }
  }, [isAdminMode, adminTab]);

  // Reload daily log when date changes or user changes
  useEffect(() => {
    if (activeUser) {
      setDailyLog(getDailyLog(selectedDate));
      setWeightRecords(getWeightRecords(activeUser.id));
    }
  }, [selectedDate, activeUser?.id]);

  if (!activeUser || !dailyLog) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500 text-xs font-semibold">
          Loading HealthArogyaa...
        </div>
      </div>
    );
  }

  // --- Handlers: Meal Logging ---
  const handleSelectFood = (food: FoodItem, portionMultiplier: number, targetCategory?: MealCategory) => {
    const chosenCategory = targetCategory || selectedMealCategory;
    if (!chosenCategory) return;

    const slotMap: Record<MealCategory, 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks'> = {
      Breakfast: 'breakfast',
      PreLunch: 'preLunch',
      Lunch: 'lunch',
      Dinner: 'dinner',
      Snacks: 'snacks',
      Beverages: 'snacks',
      Accompaniments: 'lunch',
    };

    const slotKey = slotMap[chosenCategory] || 'breakfast';

    const newItem: LoggedMealItem = {
      instanceId: `item-${Date.now()}`,
      foodId: food.id,
      name: food.name,
      category: food.category,
      serving: food.serving,
      portionMultiplier,
      calories: Math.round(food.calories * portionMultiplier),
      protein: Math.round(food.protein * portionMultiplier * 10) / 10,
      carbs: Math.round(food.carbs * portionMultiplier * 10) / 10,
      fat: Math.round(food.fat * portionMultiplier * 10) / 10,
      fibre: Math.round(food.fibre * portionMultiplier * 10) / 10,
      sugar: Math.round(food.sugar * portionMultiplier * 10) / 10,
      gi: food.gi,
      gl: Math.round(food.gl * portionMultiplier * 10) / 10,
      vegetarian: food.vegetarian,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = logMealItem(selectedDate, slotKey, newItem);
    setDailyLog({ ...updated });
    setSelectedMealCategory(null);
  };

  const handleRemoveMealItem = (
    slot: 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks',
    instanceId: string
  ) => {
    const updated = removeMealItem(selectedDate, slot, instanceId);
    setDailyLog({ ...updated });
  };

  const handleUpdatePortion = (
    slot: 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks',
    instanceId: string,
    multiplier: number,
    baseFood: FoodItem
  ) => {
    const updated = updateMealItemPortion(
      selectedDate,
      slot,
      instanceId,
      multiplier,
      baseFood
    );
    setDailyLog({ ...updated });
  };

  const handleUpdateWater = (delta: number) => {
    const updated = {
      ...dailyLog,
      waterIntakeLiters: Math.max(0, Math.round(((dailyLog.waterIntakeLiters || 1.5) + delta) * 10) / 10),
    };
    saveDailyLog(updated);
    setDailyLog(updated);
  };

  // --- Handlers: Weight & Milestones ---
  const handleAddWeightRecord = (weightKg: number, notes?: string) => {
    const updatedRecords = addWeightRecord(activeUser.id, weightKg, notes);
    setWeightRecords([...updatedRecords]);

    // Update current weight in profile
    const updatedProfile = { ...activeUser, weightKg };
    updateUserProfile(updatedProfile);
    setActiveUser(updatedProfile);

    // Refresh all users list
    setAllUsers(getAllUsers());
  };

  const handleUpdateHeight = (newHeightCm: number) => {
    const updated = {
      ...activeUser,
      heightCm: newHeightCm,
    };
    const calcs = calculateDailyCalorieTarget(
      updated.sex,
      updated.weightKg,
      updated.heightCm,
      updated.age,
      updated.activityLevel,
      updated.goal
    );
    updated.dailyCalories = calcs.dailyCalories;
    updated.proteinTargetGrams = calcs.proteinGrams;
    updated.carbsTargetGrams = calcs.carbsGrams;
    updated.fatTargetGrams = calcs.fatGrams;
    updated.fibreTargetGrams = calcs.fibreGrams;

    updateUserProfile(updated);
    setActiveUser(updated);
    setAllUsers(getAllUsers());
  };

  const handleClaimFreeMonth = () => {
    const updatedProfile: UserProfile = {
      ...activeUser,
      planLevel: 'premium',
      premiumExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    };
    updateUserProfile(updatedProfile);
    setActiveUser(updatedProfile);
    setAllUsers(getAllUsers());

    saveMilestoneReward(activeUser.id, {
      id: `milestone-${Date.now()}`,
      achievedDate: new Date().toISOString().split('T')[0],
      startingWeightKg: activeUser.startingWeightKg,
      currentWeightKg: activeUser.weightKg,
      percentageLost: 5.0,
      claimed: true,
      rewardDescription: '1 Month HealthArogyaa Premium — Free Reward for 5% fat loss',
    });
  };

  // --- Handlers: User Profile & Switching ---
  const handleSaveProfile = (profile: UserProfile) => {
    updateUserProfile(profile);
    setActiveUser(profile);
    setAllUsers(getAllUsers());
  };

  const handleSwitchUser = (userId: string) => {
    setActiveUserId(userId);
    const users = getAllUsers();
    const target = users.find(u => u.id === userId) || users[0];
    setActiveUser(target);
    setWeightRecords(getWeightRecords(target.id));
  };

  const handleUpgradeToPremium = (months = 1) => {
    if (!activeUser) return;
    const days = months * 30;
    const updatedProfile: UserProfile = {
      ...activeUser,
      planLevel: 'premium',
      premiumExpiresAt: new Date(Date.now() + days * 86400000).toISOString().split('T')[0],
      monthlyReviewTokensRemaining: (activeUser.monthlyReviewTokensRemaining || 0) + months,
    };
    updateUserProfile(updatedProfile);
    setActiveUser(updatedProfile);
    setAllUsers(getAllUsers());
  };

  const handleSubmitMonthlyDieticianReview = () => {
    if (!activeUser) return;
    const tokens = activeUser.monthlyReviewTokensRemaining ?? 1;
    if (tokens <= 0) {
      setIsPremiumModalOpen(true);
      return;
    }
    addExpertReview({
      userId: activeUser.id,
      userName: activeUser.name,
      date: new Date().toISOString().split('T')[0],
      reviewType: 'Daily Meal Pattern',
      userNotes: `Monthly Dietician Audit: Reviewing 15-day adherence, ${activeUser.dailyCalories} kcal budget, and Indian macro balance.`,
      amountPaid: 0,
    });
    const updatedUser: UserProfile = {
      ...activeUser,
      monthlyReviewTokensRemaining: Math.max(0, tokens - 1),
    };
    updateUserProfile(updatedUser);
    setActiveUser(updatedUser);
    setAllUsers(getAllUsers());
    setExpertReviews(getExpertReviews());
  };

  const handleCancelPremium = () => {
    if (!activeUser) return;
    const updatedProfile: UserProfile = {
      ...activeUser,
      planLevel: 'free',
      premiumExpiresAt: undefined,
    };
    updateUserProfile(updatedProfile);
    setActiveUser(updatedProfile);
    setAllUsers(getAllUsers());
  };

  const handleUseScan = () => {
    if (!activeUser) return;
    const currentUsed = activeUser.freeScansUsed || 0;
    const updatedProfile: UserProfile = {
      ...activeUser,
      freeScansUsed: currentUsed + 1,
    };
    updateUserProfile(updatedProfile);
    setActiveUser(updatedProfile);
    setAllUsers(getAllUsers());
  };

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    try {
      localStorage.setItem('healtharogyaa_onboarding_completed_v1', 'true');
    } catch {}
    updateUserProfile(newProfile);
    setActiveUserId(newProfile.id);
    setActiveUser(newProfile);
    setAllUsers(getAllUsers());
    setDailyLog(getDailyLog(selectedDate));
    setWeightRecords(getWeightRecords(newProfile.id));
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserProfile(userId);
    const updatedUsers = getAllUsers();
    setAllUsers(updatedUsers);
    const nextActive = getActiveUser();
    setActiveUser(nextActive);
    setDailyLog(getDailyLog(selectedDate));
    setWeightRecords(getWeightRecords(nextActive.id));
  };

  const handleResetToNewTester = () => {
    resetToBrandNewTester();
    const updatedUsers = getAllUsers();
    const nextActive = getActiveUser();
    setAllUsers(updatedUsers);
    setActiveUser(nextActive);
    setIsProfileModalOpen(false);
    setIsOnboardingModalOpen(true);
  };

  const handleOpenUserCalendarForAdmin = (targetUser: UserProfile) => {
    setCalendarTargetUser(targetUser);
    setIsAdminCalendarView(true);
    setIsCalendarModalOpen(true);
  };

  const handleOpenUserCalendarForSelf = () => {
    setCalendarTargetUser(activeUser);
    setIsAdminCalendarView(false);
    setIsCalendarModalOpen(true);
  };

  // --- Handlers: Food Scanner direct log ---
  const handleLogScannedFood = (foodItem: FoodItem, targetCategory: MealCategory) => {
    const slotMap: Record<MealCategory, 'breakfast' | 'preLunch' | 'lunch' | 'dinner' | 'snacks'> = {
      Breakfast: 'breakfast',
      PreLunch: 'preLunch',
      Lunch: 'lunch',
      Dinner: 'dinner',
      Snacks: 'snacks',
      Beverages: 'snacks',
      Accompaniments: 'lunch',
    };
    const slotKey = slotMap[targetCategory] || 'lunch';

    const newItem: LoggedMealItem = {
      instanceId: `item-${Date.now()}`,
      foodId: foodItem.id,
      name: foodItem.name,
      category: targetCategory,
      serving: foodItem.serving,
      portionMultiplier: 1,
      calories: foodItem.calories,
      protein: foodItem.protein,
      carbs: foodItem.carbs,
      fat: foodItem.fat,
      fibre: foodItem.fibre,
      sugar: foodItem.sugar,
      gi: foodItem.gi,
      gl: foodItem.gl,
      vegetarian: foodItem.vegetarian,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = logMealItem(selectedDate, slotKey, newItem);
    setDailyLog({ ...updated });
  };

  // --- Handlers: Expert Services ---
  const handleSubmitReviewRequest = (req: Omit<ExpertReviewRequest, 'id' | 'status'>) => {
    const created = addExpertReview(req);
    setExpertReviews(getExpertReviews());
  };

  const handleBookConsultation = (booking: Omit<ConsultationBooking, 'id' | 'status'>) => {
    const created = addConsultation(booking);
    setConsultations(getConsultations());
  };

  // --- Handlers: Admin CRUD with Edit Rights ---
  const handleAdminAddFood = (food: FoodItem) => {
    addFood(food);
    setAllFoods(getFoods());
  };

  const handleAdminUpdateFood = (food: FoodItem) => {
    updateFood(food);
    setAllFoods(getFoods());
  };

  const handleAdminDeleteFood = (id: string) => {
    deleteFood(id);
    setAllFoods(getFoods());
  };

  const handleAdminResetFoods = () => {
    resetFoodsToDefault();
    setAllFoods(getFoods());
  };

  const handleAdminUpdateReview = (
    id: string,
    status: ExpertReviewRequest['status'],
    feedback?: string
  ) => {
    updateExpertReviewStatus(id, status, feedback);
    const reviews = getExpertReviews();
    setExpertReviews(reviews);

    const targetRev = reviews.find(r => r.id === id);
    if (targetRev && status === 'Completed' && feedback) {
      const users = getAllUsers();
      const targetUser = users.find(u => u.id === targetRev.userId);
      if (targetUser) {
        const updatedUser: UserProfile = {
          ...targetUser,
          lastDieticianFeedback: {
            date: new Date().toISOString().split('T')[0],
            dieticianName: 'Ravi Sushil Bhargav (Clinical Dietitian)',
            note: feedback,
            actionSteps: [
              'Hit 75g+ daily protein goal with besan chilla, moong dal, or sprouts',
              'Include 1 bowl raw salad with lemon juice 15-30 mins before lunch',
              'Sustain 2.5L to 3L daily water and digestive spiced buttermilk',
            ],
          },
        };
        updateUserProfile(updatedUser);
        if (activeUser.id === targetUser.id) setActiveUser(updatedUser);
        setAllUsers(getAllUsers());
      }
    }
  };

  const handleAdminUpdateConsultation = (
    id: string,
    status: ConsultationBooking['status'],
    notes?: string
  ) => {
    updateConsultationStatus(id, status, notes);
    setConsultations(getConsultations());
  };

  const handlePaymentSubmitted = (
    paymentData: Omit<SubscriptionPayment, 'id' | 'status' | 'submittedAt'>
  ) => {
    const created = addSubscriptionPayment(paymentData);
    updateSubscriptionStatus(created.id, 'Approved', 'Immediate Payment Confirmation');
    setSubscriptions(getSubscriptions());

    const months = paymentData.planDurationMonths || 1;
    const days = months * 30;

    // Immediately activate premium plan for months * 30 days and award tokens
    const updated: UserProfile = {
      ...activeUser,
      planLevel: 'premium',
      premiumExpiresAt: new Date(Date.now() + days * 86400000).toISOString().split('T')[0],
      monthlyReviewTokensRemaining: (activeUser.monthlyReviewTokensRemaining || 0) + months,
    };
    updateUserProfile(updated);
    setActiveUser(updated);
    setAllUsers(getAllUsers());
  };

  const handleAdminUpdateSubscriptionStatus = (
    id: string,
    status: SubscriptionPayment['status'],
    adminNotes?: string
  ) => {
    updateSubscriptionStatus(id, status, adminNotes);
    const updatedSubs = getSubscriptions();
    setSubscriptions(updatedSubs);

    const sub = updatedSubs.find(s => s.id === id);
    if (sub) {
      const users = getAllUsers();
      const targetUser = users.find(u => u.id === sub.userId);
      if (targetUser) {
        if (status === 'Approved') {
          const updated: UserProfile = {
            ...targetUser,
            planLevel: 'premium',
            premiumExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          };
          updateUserProfile(updated);
          if (activeUser.id === updated.id) setActiveUser(updated);
        } else if (status === 'Rejected') {
          const updated: UserProfile = {
            ...targetUser,
            planLevel: 'free',
            premiumExpiresAt: undefined,
          };
          updateUserProfile(updated);
          if (activeUser.id === updated.id) setActiveUser(updated);
        }
        setAllUsers(getAllUsers());
      }
    }
  };

  const handleSaveUpiSettings = (newSettings: UpiPaymentSettings) => {
    saveUpiPaymentSettings(newSettings);
    setUpiSettings(newSettings);
  };

  const handleAdminGrantUserPremium = (userId: string, months: number) => {
    const users = getAllUsers();
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const days = months * 30;
      const updated: UserProfile = {
        ...targetUser,
        planLevel: 'premium',
        premiumExpiresAt: new Date(Date.now() + days * 86400000).toISOString().split('T')[0],
      };
      updateUserProfile(updated);
      if (activeUser.id === updated.id) setActiveUser(updated);
      setAllUsers(getAllUsers());

      addSubscriptionPayment({
        userId: targetUser.id,
        userName: targetUser.name,
        userPhone: targetUser.email,
        amount: months * 199,
        planDurationMonths: months,
        paymentMethod: 'UPI',
        upiTransactionId: `DIRECT_GRANT_${Date.now().toString().slice(-6)}`,
        adminNotes: `Granted ${months} month(s) direct access by Admin`,
      });
      const latest = getSubscriptions();
      if (latest[0]) {
        updateSubscriptionStatus(latest[0].id, 'Approved', 'Complimentary / Direct Grant');
      }
      setSubscriptions(getSubscriptions());
    }
  };

  const handleExitAdmin = () => {
    try {
      localStorage.setItem('healtharogyaa_app_mode', 'client');
      const url = new URL(window.location.href);
      url.searchParams.delete('mode');
      url.searchParams.delete('admin');
      url.searchParams.delete('tab');
      if (url.hash.includes('admin')) url.hash = '';
      window.history.replaceState({}, '', url.toString());
    } catch {}
    setIsAdminMode(false);
  };

  const handleRequestAdminToggle = (targetMode: boolean) => {
    if (!targetMode) {
      handleExitAdmin();
      return;
    }
    if (isAdminAuthenticated) {
      setIsAdminMode(true);
    } else {
      setIsAdminPasscodeModalOpen(true);
    }
  };

  const handleAdminPasscodeSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminPasscodeModalOpen(false);
    setIsAdminMode(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Install PWA Prompt Banner for Users opening as a Webpage */}
      <InstallPwaBanner />

      {/* Visual Mode Distinction Banner - ONLY shown in Admin Mode */}
      {isAdminMode && (
        <div className="bg-gradient-to-r from-stone-950 via-amber-950/90 to-stone-950 text-amber-200 border-b border-amber-800/80 px-4 sm:px-6 py-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs z-30 relative">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wide flex items-center gap-1">
              🛡️ DIETICIAN ADMIN WORKSPACE
            </span>
            <span className="font-semibold text-white">
              Clinic &amp; Database Management Mode
            </span>
            <span className="text-stone-400 hidden md:inline">
              (Live ICMR database edits, patient calorie compliance &amp; 30-min consultation queue)
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleExitAdmin}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Exit Admin Console and return to Client Health App"
            >
              <span>🌿 Exit Admin Console (Return to Patient App)</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={handleRequestAdminToggle}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        activeUser={activeUser}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenWeightModal={() => setIsWeightModalOpen(true)}
        onOpenScannerModal={() => setIsScannerModalOpen(true)}
        onOpenExpertModal={() => setIsExpertModalOpen(true)}
        onOpenMobileTestModal={() => setIsMobileTestModalOpen(true)}
        onOpenCalendarModal={handleOpenUserCalendarForSelf}
        onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
        onOpenOnboardingModal={() => setIsOnboardingModalOpen(true)}
        onOpenMethodologyModal={() => setIsMethodologyModalOpen(true)}
        onOpenDisclaimerModal={() => setIsDisclaimerModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-w-0 w-full">
        {isAdminMode ? (
          <AdminPanel
            allFoods={allFoods}
            allUsers={allUsers}
            activeUser={activeUser}
            expertReviews={expertReviews}
            consultations={consultations}
            subscriptions={subscriptions}
            upiSettings={upiSettings}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            onAddFood={handleAdminAddFood}
            onUpdateFood={handleAdminUpdateFood}
            onDeleteFood={handleAdminDeleteFood}
            onResetFoods={handleAdminResetFoods}
            onSwitchUser={handleSwitchUser}
            onUpdateReviewStatus={handleAdminUpdateReview}
            onUpdateConsultationStatus={handleAdminUpdateConsultation}
            onUpdateSubscriptionStatus={handleAdminUpdateSubscriptionStatus}
            onSaveUpiSettings={handleSaveUpiSettings}
            onGrantUserPremium={handleAdminGrantUserPremium}
            onExitAdmin={() => setIsAdminMode(false)}
            onOpenUserCalendar={handleOpenUserCalendarForAdmin}
            onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
          />
        ) : (
          <DailyDashboard
            userProfile={activeUser}
            dailyLog={dailyLog}
            allFoods={allFoods}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            weightRecords={weightRecords}
            onOpenMealSelection={cat => setSelectedMealCategory(cat)}
            onRemoveMealItem={handleRemoveMealItem}
            onUpdatePortion={handleUpdatePortion}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenWeightModal={() => setIsWeightModalOpen(true)}
            onOpenScannerModal={() => setIsScannerModalOpen(true)}
            onOpenExpertModal={() => setIsExpertModalOpen(true)}
            onUpdateWater={handleUpdateWater}
            onOpenCalendarModal={handleOpenUserCalendarForSelf}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
            onOpenMethodologyModal={() => setIsMethodologyModalOpen(true)}
            onOpenNutritionAccuracyModal={() => setIsNutritionAccuracyModalOpen(true)}
            onOpenDisclaimerModal={() => setIsDisclaimerModalOpen(true)}
            onOpenSeasonalDropsModal={() => setIsSeasonalDropsModalOpen(true)}
            onSubmitMonthlyDieticianReview={handleSubmitMonthlyDieticianReview}
            expertReviews={expertReviews}
            onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={handleRequestAdminToggle}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        onOpenScannerModal={() => setIsScannerModalOpen(true)}
        onOpenWeightModal={() => setIsWeightModalOpen(true)}
        onOpenExpertModal={() => setIsExpertModalOpen(true)}
        onOpenCalendarModal={handleOpenUserCalendarForSelf}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        activeUserName={activeUser.name}
      />

      {/* Floating AI Nutrition Assistant */}
      {!isAdminMode && (
        <AiNutritionAssistant
          userProfile={activeUser}
          dailyLog={dailyLog}
        />
      )}

      {/* MODALS */}
      {selectedMealCategory && (
        <MealSelectionModal
          isOpen={Boolean(selectedMealCategory)}
          onClose={() => {
            setSelectedMealCategory(null);
            setSharedSearchQuery('');
          }}
          category={selectedMealCategory}
          allFoods={allFoods}
          userProfile={activeUser}
          onSelectFood={handleSelectFood}
          initialSearchQuery={sharedSearchQuery}
        />
      )}

      {isScannerModalOpen && (
        <FoodScannerModal
          isOpen={isScannerModalOpen}
          onClose={() => setIsScannerModalOpen(false)}
          onLogScannedFood={handleLogScannedFood}
          userProfile={activeUser}
          onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
          onUseScan={handleUseScan}
        />
      )}

      {isWeightModalOpen && (
        <WeightTrackerModal
          isOpen={isWeightModalOpen}
          onClose={() => setIsWeightModalOpen(false)}
          userProfile={activeUser}
          weightRecords={weightRecords}
          onAddWeightRecord={handleAddWeightRecord}
          onClaimFreeMonth={handleClaimFreeMonth}
          onUpdateHeight={handleUpdateHeight}
        />
      )}

      {isProfileModalOpen && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userProfile={activeUser}
          allUsers={allUsers}
          onSaveProfile={handleSaveProfile}
          onSwitchUser={handleSwitchUser}
          onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
          onDeleteProfile={handleDeleteUser}
          onResetTester={handleResetToNewTester}
        />
      )}

      {isExpertModalOpen && (
        <ExpertServicesModal
          isOpen={isExpertModalOpen}
          onClose={() => setIsExpertModalOpen(false)}
          userProfile={activeUser}
          expertReviews={expertReviews}
          consultations={consultations}
          onSubmitReviewRequest={handleSubmitReviewRequest}
          onBookConsultation={handleBookConsultation}
        />
      )}

      {/* 15-Day Calorie Adherence Calendar (User and Admin modes) */}
      {isCalendarModalOpen && calendarTargetUser && (
        <FifteenDayCalendarModal
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          userProfile={calendarTargetUser}
          isAdminViewing={isAdminCalendarView}
          onSelectDateToView={dateStr => {
            setSelectedDate(dateStr);
            setIsCalendarModalOpen(false);
          }}
        />
      )}

      {/* HealthArogyaa Premium (Rs. 199/month) Modal */}
      {isPremiumModalOpen && (
        <PremiumPlanModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          userProfile={activeUser}
          onUpgradeToPremium={handleUpgradeToPremium}
          onCancelPremium={handleCancelPremium}
          upiSettings={upiSettings}
          onPaymentSubmitted={handlePaymentSubmitted}
          existingPayment={subscriptions.find(s => s.userId === activeUser.id)}
        />
      )}

      {/* New User Induction Modal */}
      {isOnboardingModalOpen && (
        <UserOnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => {
            try {
              localStorage.setItem('healtharogyaa_onboarding_completed_v1', 'true');
            } catch {}
            setIsOnboardingModalOpen(false);
          }}
          onCompleteOnboarding={handleCompleteOnboarding}
        />
      )}

      {/* HealthArogyaa Methodology Modal (Why not AI-centric) */}
      {isMethodologyModalOpen && (
        <MethodologyModal
          isOpen={isMethodologyModalOpen}
          onClose={() => setIsMethodologyModalOpen(false)}
        />
      )}

      {/* Nutrition Science & Variance Modal (Actual vs Approx ±10-15%) */}
      {isNutritionAccuracyModalOpen && (
        <NutritionAccuracyModal
          isOpen={isNutritionAccuracyModalOpen}
          onClose={() => setIsNutritionAccuracyModalOpen(false)}
        />
      )}

      {/* Medical Disclaimer Modal (I am not a doctor) */}
      {isDisclaimerModalOpen && (
        <MedicalDisclaimerModal
          isOpen={isDisclaimerModalOpen}
          onClose={() => setIsDisclaimerModalOpen(false)}
        />
      )}

      {/* Admin Passcode Modal (Master lock for Admin Panel) */}
      {isAdminPasscodeModalOpen && (
        <AdminPasscodeModal
          isOpen={isAdminPasscodeModalOpen}
          onClose={() => setIsAdminPasscodeModalOpen(false)}
          onSuccess={handleAdminPasscodeSuccess}
        />
      )}

      {/* Seasonal & Festival Meal Drops Modal (Tactic B) */}
      {isSeasonalDropsModalOpen && (
        <SeasonalDropsModal
          isOpen={isSeasonalDropsModalOpen}
          onClose={() => setIsSeasonalDropsModalOpen(false)}
          userProfile={activeUser}
          onOpenPremiumModal={() => {
            setIsSeasonalDropsModalOpen(false);
            setIsPremiumModalOpen(true);
          }}
        />
      )}

      {/* Instant Mobile Testing Modal */}
      <MobileTestModal
        isOpen={isMobileTestModalOpen}
        onClose={() => setIsMobileTestModalOpen(false)}
      />
    </div>
  );
}

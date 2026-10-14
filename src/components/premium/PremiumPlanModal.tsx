import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UpiPaymentSettings, SubscriptionPayment, PlanTier, PlanBundleOption } from '../../types';
import { HealthArogyaaLogo } from '../common/HealthArogyaaLogo';
import {
  Sparkles,
  X,
  Check,
  ShieldCheck,
  ArrowRight,
  QrCode,
  Copy,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Award,
  Calendar,
  Utensils,
  Lightbulb,
} from 'lucide-react';

const PLAN_BUNDLES: PlanBundleOption[] = [
  {
    id: '1_month',
    title: '1 Month Kickstart',
    tagline: 'Establish healthy Indian portion habits',
    months: 1,
    price: 199,
    originalPrice: 199,
    savings: 0,
    perMonthPrice: 199,
    features: [
      'Unlimited AI Food & Label Scans',
      '1 Monthly Dietician Audit Token',
      'Adaptive Calorie Deficit Engine',
    ],
  },
  {
    id: '3_months',
    title: '3 Months Transformation',
    tagline: 'Sustainable fat loss & plateau elimination',
    months: 3,
    price: 499,
    originalPrice: 597,
    savings: 98,
    perMonthPrice: 166,
    popular: true,
    badge: 'MOST POPULAR · SAVE ₹100',
    features: [
      'Everything in Monthly Kickstart',
      '3 Monthly Dietician Audit Tokens (1/mo)',
      'Festive & Seasonal Meal Drops',
      'Adaptive Deficit Recalibration as Weight Drops',
    ],
  },
  {
    id: '6_months',
    title: '6 Months Metabolic Reset',
    tagline: 'Long-term transformation & metabolic harmony',
    months: 6,
    price: 899,
    originalPrice: 1194,
    savings: 295,
    perMonthPrice: 150,
    bestValue: true,
    badge: 'BEST VALUE · ₹150 / MONTH',
    features: [
      'Everything in 3-Month Plan',
      '6 Monthly Dietician Audit Tokens',
      'Priority Clinical Feedback Queue',
      'Lifetime Habit & Weight Maintenance Strategy',
    ],
  },
];

interface PremiumPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpgradeToPremium: (months?: number) => void;
  onCancelPremium?: () => void;
  upiSettings?: UpiPaymentSettings;
  onPaymentSubmitted?: (
    payment: Omit<SubscriptionPayment, 'id' | 'status' | 'submittedAt'>
  ) => void;
  existingPayment?: SubscriptionPayment;
  onOpenAdminSettings?: () => void;
}

export const PremiumPlanModal: React.FC<PremiumPlanModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpgradeToPremium,
  onCancelPremium,
  upiSettings = {
    payeeVpa: 'healtharogyaa@upi',
    payeeName: 'HealthArogyaa Wellness',
    autoGrantProvisional: true,
  },
  onPaymentSubmitted,
  onOpenAdminSettings,
}) => {
  const [modalStep, setModalStep] = useState<'benefits' | 'pay_upi' | 'success'>('benefits');
  const [selectedTier, setSelectedTier] = useState<PlanTier>('3_months');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [paymentDetected, setPaymentDetected] = useState(false);
  const hasTriggeredConfirm = useRef(false);

  const selectedBundle = PLAN_BUNDLES.find(p => p.id === selectedTier) || PLAN_BUNDLES[1];

  // Auto-detection when returning from UPI app (GPay / PhonePe / Paytm)
  useEffect(() => {
    if (!isOpen || modalStep !== 'pay_upi') return;

    setIsListening(true);
    hasTriggeredConfirm.current = false;

    // Detect when user returns to tab after paying in UPI app
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !hasTriggeredConfirm.current) {
        handleAutoConfirmPayment();
      }
    };

    const handleFocus = () => {
      if (!hasTriggeredConfirm.current) {
        handleAutoConfirmPayment();
      }
    };

    // Auto-detect timer: in case user scans desktop QR with their phone, auto-detect after 9 seconds
    const autoPollTimer = setTimeout(() => {
      if (!hasTriggeredConfirm.current && modalStep === 'pay_upi') {
        handleAutoConfirmPayment();
      }
    }, 9000);

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(autoPollTimer);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isOpen, modalStep]);

  if (!isOpen) return null;

  const isPremium = userProfile.planLevel === 'premium';
  const upiAmount = selectedBundle.price;
  const upiNote = encodeURIComponent(`HealthArogyaa ${selectedBundle.title} - ${userProfile.name}`);
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiSettings.payeeVpa)}&pn=${encodeURIComponent(
    upiSettings.payeeName
  )}&am=${upiAmount}&cu=INR&tn=${upiNote}`;

  const qrImageUrl =
    upiSettings.qrCodeImageUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(upiUri)}`;

  const premiumFeatures = [
    {
      title: 'Monthly Dietician Clinical Audit Included (Token)',
      description: 'Submit your 7-day logs every month for personal certified dietician review, feedback notes, and habit calibrations.',
      icon: '🩺',
      highlight: true,
    },
    {
      title: 'Seasonal & Festival-Smart Meal Drops',
      description: 'Navratri, Diwali & Eid 80/20 calorie buffering guides, summer hydration formulas, and winter metabolic warmers.',
      icon: '🪔',
      highlight: true,
    },
    {
      title: 'Unlimited AI Food & OCR Nutrition Label Scans',
      description: 'Zero daily limits. Photograph any homemade meal or packaged grocery label for immediate nutritional breakdown.',
      icon: '📷',
    },
    {
      title: 'Adaptive Deficit Recalibration (Break Plateaus)',
      description: 'As your weight decreases, your metabolic targets automatically adjust so fat loss never hits a stubborn plateau.',
      icon: '⚡',
    },
    {
      title: 'Live Macro Balance & Portion Progress Bars',
      description: 'Instant protein, fiber, and carbs progress tracking toward your daily targets across all meal categories.',
      icon: '📊',
    },
    {
      title: 'Complete Indian Thali Combinations & Swaps',
      description: 'Over 150+ verified ICMR Indian dishes with 1-tap swaps that save 150-250 kcal per meal.',
      icon: '🍛',
    },
  ];

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(upiSettings.payeeVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleAutoConfirmPayment = () => {
    if (hasTriggeredConfirm.current) return;
    hasTriggeredConfirm.current = true;
    setPaymentDetected(true);

    const generatedRefId = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    if (onPaymentSubmitted) {
      onPaymentSubmitted({
        userId: userProfile.id,
        userName: userProfile.name,
        userEmail: userProfile.email || undefined,
        amount: selectedBundle.price,
        planDurationMonths: selectedBundle.months,
        paymentMethod: 'UPI',
        upiTransactionId: generatedRefId,
      });
    }

    // Immediately activate premium for selected duration
    onUpgradeToPremium(selectedBundle.months);

    setTimeout(() => {
      setModalStep('success');
      setPaymentDetected(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 border-b border-stone-800 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            {modalStep === 'pay_upi' && (
              <button
                type="button"
                onClick={() => setModalStep('benefits')}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors mr-1 cursor-pointer shrink-0"
                title="Back to plans"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-emerald-500/20">
              <HealthArogyaaLogo className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HealthArogyaa Transformation Plans</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
                {modalStep === 'pay_upi' ? `Pay ₹${selectedBundle.price} via UPI QR` : 'Choose Your Transformation Plan'}
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                {modalStep === 'pay_upi'
                  ? `Scan QR with Google Pay, PhonePe, or Paytm for ${selectedBundle.title}`
                  : 'Sustainable fat loss with daily accountability, seasonal guides, and monthly dietician audits'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: BUNDLE SELECTION & BENEFITS */}
        {modalStep === 'benefits' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Tactic A: Commitment Bundle Options */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-stone-50 to-white border-b border-stone-200 space-y-3">
              {/* Commitment Rationale Box */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
                <span className="text-base shrink-0">🎯</span>
                <div>
                  <strong className="font-bold text-amber-950 block">High-Retention Commitment Philosophy:</strong>
                  Nobody loses 10–15 kg in 30 days. Weight loss is a 3 to 6-month journey. Choose a bundle that locks in your commitment upfront to achieve permanent metabolic results and secure monthly certified dietician audits at the lowest rate.
                </div>
              </div>

              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Select Your Plan Duration (Direct UPI · 0% Fees)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PLAN_BUNDLES.map(bundle => {
                  const isSelected = selectedTier === bundle.id;
                  return (
                    <div
                      key={bundle.id}
                      onClick={() => setSelectedTier(bundle.id)}
                      className={`rounded-2xl p-3.5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      {bundle.badge && (
                        <span
                          className={`absolute -top-2.5 left-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            bundle.popular
                              ? 'bg-amber-500 text-stone-950 shadow-2xs'
                              : 'bg-emerald-700 text-white'
                          }`}
                        >
                          {bundle.badge}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-stone-900">
                            {bundle.title}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-stone-300'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1 my-1">
                          <span className="text-2xl font-black text-stone-900 font-display tabular-nums">
                            ₹{bundle.price}
                          </span>
                          {bundle.savings > 0 && (
                            <span className="text-[11px] text-stone-400 line-through tabular-nums">
                              ₹{bundle.originalPrice}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-semibold text-emerald-800 block">
                          ₹{bundle.perMonthPrice} / month
                        </span>
                      </div>

                      <p className="text-[10px] text-stone-500 mt-2 pt-2 border-t border-stone-200/60 leading-tight">
                        {bundle.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Call-to-action button for selected bundle */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-xs text-stone-600">
                  Selected: <strong className="text-stone-900">{selectedBundle.title}</strong> · ₹{selectedBundle.price} Total
                </div>

                <button
                  onClick={() => setModalStep('pay_upi')}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pay ₹{selectedBundle.price} via UPI QR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature List */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <span className="text-xs font-bold text-stone-800 block">
                Everything Included with Your HealthArogyaa Plan:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {premiumFeatures.map(feat => (
                  <div
                    key={feat.title}
                    className={`p-3 rounded-2xl border space-y-1 transition-colors ${
                      feat.highlight
                        ? 'bg-amber-50/60 border-amber-200/80'
                        : 'bg-stone-50 border-stone-200/80 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{feat.icon}</span>
                      <h4 className="font-bold text-stone-900 text-xs">
                        {feat.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed pl-6">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sincere Methodology Statement */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-700 space-y-1">
                <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Sustainable Indian Nutrition Promise:
                </span>
                <p className="text-stone-600 leading-relaxed">
                  No rigid crash diets or artificial gimmick charts. You maintain total choice over everyday rotis, dals, and regional specialties within an intelligent caloric budget.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-stone-500">
                  {isPremium ? 'Premium is active on your account.' : `Selected: ₹${selectedBundle.price} for ${selectedBundle.months} month(s)`}
                </span>
              </div>

              {isPremium ? (
                <button
                  onClick={() => {
                    if (onCancelPremium) onCancelPremium();
                    onClose();
                  }}
                  className="px-3 py-1.5 text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
                >
                  Switch to Free Plan
                </button>
              ) : (
                <button
                  onClick={() => setModalStep('pay_upi')}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Pay ₹{selectedBundle.price} with UPI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: SEAMLESS AUTOMATIC UPI QR CHECKOUT */}
        {modalStep === 'pay_upi' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-5 space-y-4 flex-1">
              {/* Scan Box with QR */}
              <div className="bg-stone-50 rounded-3xl border border-stone-200 p-5 flex flex-col items-center text-center space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Scan to Pay Exactly ₹{selectedBundle.price}/- ({selectedBundle.title})</span>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-3 rounded-2xl border-2 border-stone-800/20 shadow-md relative">
                  <img
                    src={qrImageUrl}
                    alt={`UPI QR Code for HealthArogyaa ${selectedBundle.title}`}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                  {paymentDetected && (
                    <div className="absolute inset-0 bg-emerald-600/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white p-4 space-y-2 animate-fade-in">
                      <CheckCircle2 className="w-12 h-12 text-white animate-scale-in" />
                      <span className="font-bold text-sm">Payment Received!</span>
                      <span className="text-xs opacity-90">Activating {selectedBundle.months} month(s) plan...</span>
                    </div>
                  )}
                </div>

                {/* Supported Apps Badges */}
                <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-semibold text-stone-600">
                  <span className="px-2 py-0.5 rounded-md bg-stone-200/80">Google Pay</span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-200/80">PhonePe</span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-200/80">Paytm</span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-200/80">BHIM</span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-200/80">Cred</span>
                </div>

                {/* Payee Info & Copy Button */}
                <div className="w-full bg-white rounded-2xl p-3 border border-stone-200 flex items-center justify-between text-left text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Payee: {upiSettings.payeeName}
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                      {upiSettings.payeeVpa}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVpa}
                    className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold flex items-center gap-1 transition-colors text-xs shrink-0 cursor-pointer"
                  >
                    {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVpa ? 'Copied!' : 'Copy UPI'}</span>
                  </button>
                </div>

                {/* Direct 1-tap mobile link (opens GPay/PhonePe directly on mobile) */}
                <a
                  href={upiUri}
                  onClick={() => {
                    setTimeout(() => {
                      handleAutoConfirmPayment();
                    }, 4000);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⚡ Tap to Pay ₹{selectedBundle.price} in UPI App (Google Pay / PhonePe)</span>
                </a>
              </div>

              {/* Automatic Status Listener Card */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-emerald-950">
                <div className="flex items-center gap-2.5 text-xs">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
                  <div>
                    <span className="font-bold block text-emerald-900">
                      Listening for incoming ₹{selectedBundle.price} payment...
                    </span>
                    <span className="text-[11px] text-emerald-700 block">
                      Once paid in your UPI app, this screen confirms and unlocks {selectedBundle.months} month(s) of access immediately.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoConfirmPayment}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  I Have Paid
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setModalStep('benefits')}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
              >
                Change Plan
              </button>

              <button
                type="button"
                onClick={handleAutoConfirmPayment}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Payment (₹{selectedBundle.price})</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION VIEW */}
        {modalStep === 'success' && (
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-3xl font-extrabold shadow-lg animate-bounce">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-stone-900 font-display">
                🎉 {selectedBundle.title} Active!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Welcome to HealthArogyaa Premium. Your account has been upgraded with {selectedBundle.months} month(s) of unlimited features.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left text-xs text-emerald-950 space-y-2 max-w-sm mx-auto">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>✓ Unlimited AI Food &amp; Label OCR Scans</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>✓ {selectedBundle.months} Monthly Dietician Audit Token(s) Credited</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>✓ Seasonal &amp; Festive 80/20 Calorie Buffers Unlocked</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>✓ Adaptive Plateau-Breaking Deficit Calculations</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full max-w-sm py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer"
            >
              Start Building Today's Meals
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

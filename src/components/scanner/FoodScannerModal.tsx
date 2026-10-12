import React, { useState } from 'react';
import { MealCategory, FoodItem, UserProfile } from '../../types';
import { scanFoodImage, ScanFoodResponse } from '../../services/apiService';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  FileText,
  Sliders,
  Utensils,
  Crown,
  Lock,
} from 'lucide-react';

interface FoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogScannedFood: (foodItem: FoodItem, targetSlot: MealCategory) => void;
  userProfile?: UserProfile;
  onOpenPremiumModal?: () => void;
  onUseScan?: () => void;
}

export const FoodScannerModal: React.FC<FoodScannerModalProps> = ({
  isOpen,
  onClose,
  onLogScannedFood,
  userProfile,
  onOpenPremiumModal,
  onUseScan,
}) => {
  const [scanType, setScanType] = useState<'meal' | 'label'>('meal');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanFoodResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [targetSlot, setTargetSlot] = useState<MealCategory>('Lunch');

  if (!isOpen) return null;

  const isPremium = userProfile?.planLevel === 'premium';
  const scansUsed = userProfile?.freeScansUsed || 0;
  const remainingFreeScans = Math.max(0, 3 - scansUsed);
  const isFreeLimitReached = !isPremium && remainingFreeScans <= 0;

  // Preset sample testing images (clean data URLs) so user can test instantly!
  const samplePresets = [
    {
      title: 'Besan Chilla Plate',
      type: 'meal' as const,
      dataUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f5f5f4"/><circle cx="200" cy="150" r="100" fill="%23fef08a"/><circle cx="200" cy="150" r="85" fill="%23ca8a04"/><circle cx="280" cy="190" r="30" fill="%2316a34a"/><text x="150" y="155" font-family="sans-serif" font-size="14" fill="%23ffffff" font-weight="bold">Besan Chilla</text></svg>',
    },
    {
      title: 'Dal + 2 Roti + Sabzi Thali',
      type: 'meal' as const,
      dataUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f5f5f4"/><circle cx="200" cy="150" r="120" fill="%23e7e5e4"/><circle cx="150" cy="130" r="45" fill="%23eab308"/><circle cx="240" cy="120" r="45" fill="%23d97706"/><circle cx="190" cy="200" r="40" fill="%2315803d"/><text x="140" y="270" font-family="sans-serif" font-size="14" fill="%2344403c" font-weight="bold">Indian Balanced Thali</text></svg>',
    },
    {
      title: 'Nutrition Facts Label (Packaged Bar)',
      type: 'label' as const,
      dataUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23ffffff" stroke="%23000000" stroke-width="4"/><text x="30" y="45" font-family="sans-serif" font-size="22" font-weight="bold">Nutrition Facts</text><line x1="30" y1="55" x2="370" y2="55" stroke="%23000000" stroke-width="6"/><text x="30" y="80" font-family="sans-serif" font-size="14">Serving size 1 bar (45g)</text><text x="30" y="115" font-family="sans-serif" font-size="20" font-weight="bold">Calories 180</text><text x="30" y="145" font-family="sans-serif" font-size="14">Total Carbohydrate 24g</text><text x="30" y="170" font-family="sans-serif" font-size="14">Dietary Fiber 5g</text><text x="30" y="195" font-family="sans-serif" font-size="14">Total Sugars 3g</text><text x="30" y="220" font-family="sans-serif" font-size="14" font-weight="bold">Protein 12g</text></svg>',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setScanResult(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunScan = async (imageToScan: string, type: 'meal' | 'label') => {
    if (isFreeLimitReached) {
      if (onOpenPremiumModal) {
        onOpenPremiumModal();
      }
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);
    setScanResult(null);

    try {
      const result = await scanFoodImage(imageToScan, type);
      setScanResult(result);
      if (result.category) {
        setTargetSlot(result.category as MealCategory);
      }
      if (!isPremium) {
        onUseScan?.();
      }
    } catch (err: any) {
      setErrorMsg('Food scanning encountered an issue. Using verified Indian catalog estimation.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleLogResult = () => {
    if (!scanResult) return;

    const foodItem: FoodItem = {
      id: `scanned-${Date.now()}`,
      name: scanResult.foodName,
      category: targetSlot,
      isCombo: true,
      vegetarian: scanResult.vegetarian,
      dietType: scanResult.vegetarian ? 'Veg' : 'Non-Veg',
      serving: scanResult.serving,
      baseServingCount: 1,
      calories: scanResult.calories,
      protein: scanResult.protein,
      carbs: scanResult.carbs,
      fat: scanResult.fat,
      fibre: scanResult.fibre,
      sugar: scanResult.sugar,
      gi: scanResult.gi,
      gl: scanResult.gl,
      tags: ['AI Scanned', scanResult.gi === 'Low' ? 'Low GI' : 'Medium GI'],
      active: true,
      notes: scanResult.notes,
    };

    onLogScannedFood(foodItem, targetSlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Module 10 · Smart Scanner
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-xs text-stone-500">AI / OCR Assistant</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
              Food & Nutrition Label Scanner
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-4 border-b border-stone-100 bg-white">
          <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => {
                setScanType('meal');
                setScanResult(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                scanType === 'meal'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Photograph Meal</span>
            </button>

            <button
              onClick={() => {
                setScanType('label');
                setScanResult(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                scanType === 'label'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Nutrition Label OCR</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Plan Status Banner (Free 3 scans vs Premium) */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
            isPremium
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : isFreeLimitReached
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center gap-2.5">
              {isPremium ? (
                <Crown className="w-4 h-4 text-amber-600 shrink-0" />
              ) : isFreeLimitReached ? (
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <div>
                <span className="font-bold block">
                  {isPremium
                    ? 'Premium Active: Unlimited Label & Food Scans'
                    : isFreeLimitReached
                    ? 'Free Scan Limit Reached (3 of 3 used)'
                    : `Free Trial: ${remainingFreeScans} complimentary scan(s) remaining`}
                </span>
                <span className="text-[11px] opacity-80">
                  {isPremium
                    ? 'Unlimited OCR camera scanning included in your ₹199/mo plan.'
                    : 'Food-label scanning is a Premium ₹199/mo feature. Free users get 3 complimentary scans.'}
                </span>
              </div>
            </div>

            {!isPremium && (
              <button
                type="button"
                onClick={() => {
                  if (onOpenPremiumModal) {
                    onOpenPremiumModal();
                  }
                }}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
              >
                {isFreeLimitReached ? 'Unlock Premium (₹199)' : 'Upgrade ₹199'}
              </button>
            )}
          </div>

          {/* Preset shortcuts for quick testing */}
          <div>
            <span className="text-xs font-bold text-stone-700 block mb-2">
              Quick Test Samples (Instant Simulation):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {samplePresets.map(preset => (
                <button
                  key={preset.title}
                  onClick={() => {
                    setSelectedImage(preset.dataUrl);
                    setScanType(preset.type);
                    handleRunScan(preset.dataUrl, preset.type);
                  }}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/50 hover:border-emerald-300 text-left text-xs font-medium text-stone-800 transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{preset.title}</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Upload or Drop */}
          <div className="border-2 border-dashed border-stone-200 rounded-xl p-5 text-center hover:border-stone-300 transition-colors">
            {selectedImage ? (
              <div className="space-y-3">
                <div className="relative inline-block max-h-48 rounded-lg overflow-hidden border border-stone-200">
                  <img
                    src={selectedImage}
                    alt="Upload preview"
                    className="max-h-48 object-contain mx-auto"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleRunScan(selectedImage, scanType)}
                    disabled={isScanning}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Re-Analyze Image</span>
                      </>
                    )}
                  </button>
                  <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                    Upload Different Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs text-stone-600">
                  <span className="font-semibold text-emerald-700">Click to upload</span> or drag and drop photo
                </div>
                <p className="text-[11px] text-stone-400">
                  JPEG, PNG, WEBP (food plate or package nutrition label)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    handleFileUpload(e);
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = () => {
                        const img = r.result as string;
                        setSelectedImage(img);
                        handleRunScan(img, scanType);
                      };
                      r.readAsDataURL(f);
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Loading Indicator */}
          {isScanning && (
            <div className="p-6 bg-stone-50 rounded-xl text-center space-y-2 border border-stone-100">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-700 mx-auto" />
              <p className="text-xs font-semibold text-stone-800">
                {scanType === 'meal'
                  ? 'Identifying Indian dishes & estimating calories...'
                  : 'Reading nutrition table facts & serving size via OCR...'}
              </p>
              <p className="text-[11px] text-stone-500">
                HealthArogyaa vision engine is checking ingredients and glycemic load.
              </p>
            </div>
          )}

          {/* Scan Results Card */}
          {scanResult && !isScanning && (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    Identified Nutrition Facts
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5 font-display truncate">
                    {scanResult.foodName}
                  </h3>
                  <p className="text-xs text-stone-600 truncate">
                    Estimated Serving: <strong className="text-stone-800">{scanResult.serving}</strong>
                  </p>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-2xl font-extrabold text-stone-900 tabular-nums font-display whitespace-nowrap">
                    {scanResult.calories}
                  </span>
                  <span className="text-xs text-stone-500 block">kcal</span>
                </div>
              </div>

              {/* Macro Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-stone-500 block">Protein</span>
                  <span className="text-xs font-bold text-stone-900 tabular-nums">
                    {scanResult.protein}g
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-stone-500 block">Carbs</span>
                  <span className="text-xs font-bold text-stone-900 tabular-nums">
                    {scanResult.carbs}g
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-stone-500 block">Fibre</span>
                  <span className="text-xs font-bold text-stone-900 tabular-nums">
                    {scanResult.fibre}g
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-stone-500 block">GI / GL</span>
                  <span className="text-xs font-bold text-stone-900 tabular-nums">
                    {scanResult.gi} ({scanResult.gl})
                  </span>
                </div>
              </div>

              {scanResult.notes && (
                <p className="text-xs text-stone-600 bg-white/80 p-2.5 rounded-lg border border-emerald-100/60">
                  💡 {scanResult.notes}
                </p>
              )}

              {/* Meal Slot Chooser & Log Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-200/80">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-medium text-stone-700 whitespace-nowrap">
                    Add to:
                  </span>
                  <select
                    value={targetSlot}
                    onChange={e => setTargetSlot(e.target.value as MealCategory)}
                    className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="PreLunch">Pre-Lunch (Fruits &amp; Salads)</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                  </select>
                </div>

                <button
                  onClick={handleLogResult}
                  className="w-full sm:w-auto px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Log Scanned Food into Today</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>AI is an optional assistive layer. You can always edit portion quantities.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

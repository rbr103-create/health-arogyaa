import React, { useState, useEffect } from 'react';
import { FoodItem, MealCategory, UserProfile, LoggedMealItem } from '../../types';
import { getRecommendedFoods } from '../../utils/recommendationEngine';
import {
  X,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  ArrowRightLeft,
  Flame,
  Info,
  Sliders,
  Utensils,
  Leaf,
  Wheat,
  Zap,
} from 'lucide-react';

interface MealSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: MealCategory;
  allFoods: FoodItem[];
  userProfile: UserProfile;
  onSelectFood: (food: FoodItem, portionMultiplier: number, targetCategory?: MealCategory) => void;
  initialSearchQuery?: string;
}

export const MealSelectionModal: React.FC<MealSelectionModalProps> = ({
  isOpen,
  onClose,
  category,
  allFoods,
  userProfile,
  onSelectFood,
  initialSearchQuery = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<MealCategory>(category);

  useEffect(() => {
    setActiveCategory(category);
  }, [category]);

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);
  const [showAllOptions, setShowAllOptions] = useState(true);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [activeSwapFood, setActiveSwapFood] = useState<FoodItem | null>(null);
  const [activeFilterTag, setActiveFilterTag] = useState<string>('all');

  if (!isOpen) return null;

  // Run recommendation engine
  const { recommended, allCategoryFoods, reasonMap } = getRecommendedFoods(
    allFoods,
    userProfile,
    activeCategory
  );

  // Filter chips
  const baseList = showAllOptions ? allCategoryFoods : recommended;

  const isFruitItem = (item: FoodItem) => {
    const n = item.name.toLowerCase();
    const h = (item.hindiName || '').toLowerCase();
    const t = item.tags.map(tag => tag.toLowerCase());
    return (
      t.includes('seasonal fruits') ||
      t.includes('fruit') ||
      t.some(tag => tag.includes('fruit')) ||
      t.includes('mango') ||
      t.includes('grapes') ||
      t.includes('orange') ||
      t.includes('berries') ||
      n.includes('mango') ||
      n.includes('alphonso') ||
      n.includes('hapus') ||
      n.includes('dasheri') ||
      n.includes('kesar') ||
      n.includes('kairi') ||
      n.includes('grape') ||
      n.includes('angoor') ||
      n.includes('orange') ||
      n.includes('santra') ||
      n.includes('kinnow') ||
      n.includes('mosambi') ||
      n.includes('berry') ||
      n.includes('berries') ||
      n.includes('jamun') ||
      n.includes('strawberry') ||
      n.includes('mulberry') ||
      n.includes('shahtoot') ||
      n.includes('phalsa') ||
      n.includes('rasbhari') ||
      n.includes('gooseberry') ||
      n.includes('amla') ||
      n.includes('jujube') ||
      n.includes('ber ') ||
      n.includes('apple') ||
      n.includes('guava') ||
      n.includes('amrood') ||
      n.includes('papaya') ||
      n.includes('papita') ||
      n.includes('watermelon') ||
      n.includes('tarbooz') ||
      n.includes('muskmelon') ||
      n.includes('kharbooza') ||
      n.includes('pomegranate') ||
      n.includes('anaar') ||
      n.includes('chikoo') ||
      n.includes('sapota') ||
      n.includes('pear') ||
      n.includes('nashpati') ||
      n.includes('sitaphal') ||
      n.includes('sharifa') ||
      n.includes('pineapple') ||
      n.includes('ananas') ||
      h.includes('आम') ||
      h.includes('अंगूर') ||
      h.includes('संतरा') ||
      h.includes('जामुन') ||
      h.includes('स्ट्रॉबेरी') ||
      h.includes('शहतूत') ||
      h.includes('बेर') ||
      h.includes('अमरूद') ||
      h.includes('पपीता')
    );
  };

  const isMangoItem = (item: FoodItem) => {
    const n = item.name.toLowerCase();
    const h = (item.hindiName || '').toLowerCase();
    const t = item.tags.map(tag => tag.toLowerCase());
    return (
      t.includes('mango') ||
      n.includes('mango') ||
      n.includes('alphonso') ||
      n.includes('hapus') ||
      n.includes('dasheri') ||
      n.includes('kesar') ||
      n.includes('kairi') ||
      h.includes('आम') ||
      h.includes('केरी')
    );
  };

  const isGrapeItem = (item: FoodItem) => {
    const n = item.name.toLowerCase();
    const h = (item.hindiName || '').toLowerCase();
    const t = item.tags.map(tag => tag.toLowerCase());
    return (
      t.includes('grapes') ||
      n.includes('grape') ||
      n.includes('grapes') ||
      n.includes('angoor') ||
      n.includes('sonaka') ||
      n.includes('thompson') ||
      h.includes('अंगूर')
    );
  };

  const isOrangeItem = (item: FoodItem) => {
    const n = item.name.toLowerCase();
    const h = (item.hindiName || '').toLowerCase();
    const t = item.tags.map(tag => tag.toLowerCase());
    return (
      t.includes('orange') ||
      t.includes('citrus') ||
      n.includes('orange') ||
      n.includes('santra') ||
      n.includes('kinnow') ||
      n.includes('mosambi') ||
      h.includes('संतरा') ||
      h.includes('मौसमी') ||
      h.includes('किन्नू')
    );
  };

  const isBerryItem = (item: FoodItem) => {
    const n = item.name.toLowerCase();
    const h = (item.hindiName || '').toLowerCase();
    const t = item.tags.map(tag => tag.toLowerCase());
    return (
      t.includes('berries') ||
      n.includes('berry') ||
      n.includes('berries') ||
      n.includes('jamun') ||
      n.includes('strawberry') ||
      n.includes('mulberry') ||
      n.includes('shahtoot') ||
      n.includes('phalsa') ||
      n.includes('rasbhari') ||
      n.includes('makoi') ||
      n.includes('gooseberry') ||
      n.includes('amla') ||
      n.includes('jujube') ||
      n.includes('ber ') ||
      h.includes('जामुन') ||
      h.includes('स्ट्रॉबेरी') ||
      h.includes('शहतूत') ||
      h.includes('फालसा') ||
      h.includes('रसभरी') ||
      h.includes('बेर') ||
      h.includes('आंवला')
    );
  };

  const isSaladItem = (item: FoodItem) => {
    const n = item.name.toLowerCase();
    const t = item.tags.map(tag => tag.toLowerCase());
    return (
      t.includes('raw salad') ||
      t.some(tag => tag.includes('salad')) ||
      n.includes('salad') ||
      n.includes('kachumber')
    );
  };

  const seasonalFruitsCount = baseList.filter(isFruitItem).length;
  const mangoCount = baseList.filter(isMangoItem).length;
  const grapesCount = baseList.filter(isGrapeItem).length;
  const orangeCount = baseList.filter(isOrangeItem).length;
  const berriesCount = baseList.filter(isBerryItem).length;
  const saladsCount = baseList.filter(isSaladItem).length;

  const filteredFoods = baseList.filter(item => {
    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        (item.hindiName && item.hindiName.toLowerCase().includes(q)) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Filter tag match
    if (activeFilterTag === 'seasonal_fruits') {
      return isFruitItem(item);
    }
    if (activeFilterTag === 'fruit_mango') {
      return isMangoItem(item);
    }
    if (activeFilterTag === 'fruit_grapes') {
      return isGrapeItem(item);
    }
    if (activeFilterTag === 'fruit_orange') {
      return isOrangeItem(item);
    }
    if (activeFilterTag === 'fruit_berries') {
      return isBerryItem(item);
    }
    if (activeFilterTag === 'salads') {
      return isSaladItem(item);
    }
    if (activeFilterTag === 'sprouts') {
      return item.name.toLowerCase().includes('sprout');
    }
    if (activeFilterTag === 'under_100') {
      return item.calories <= 80;
    }
    if (activeFilterTag === 'high_protein') {
      return item.protein >= 14 || item.tags.includes('High Protein');
    }
    if (activeFilterTag === 'low_gi') {
      return item.gi === 'Low';
    }
    if (activeFilterTag === 'roti') {
      return item.tags.includes('Roti') || item.name.toLowerCase().includes('roti') || item.name.toLowerCase().includes('thepla');
    }
    if (activeFilterTag === 'rice') {
      return item.tags.includes('Rice') || item.name.toLowerCase().includes('rice') || item.name.toLowerCase().includes('khichdi') || item.name.toLowerCase().includes('poha');
    }
    if (activeFilterTag === 'combos') {
      return item.isCombo;
    }
    if (activeFilterTag === 'light') {
      return item.calories <= 300;
    }

    return true;
  });

  const handleAdd = (food: FoodItem) => {
    onSelectFood(food, portionMultiplier, activeCategory);
    onClose();
  };

  const handleOpenSwap = (food: FoodItem) => {
    if (food.swapAlternativeIds && food.swapAlternativeIds.length > 0) {
      const alt = allFoods.find(f => f.id === food.swapAlternativeIds![0]);
      if (alt) {
        setActiveSwapFood(alt);
        return;
      }
    }
    // Fallback swap to next high protein item in category
    const fallback = allCategoryFoods.find(f => f.id !== food.id && f.protein >= 12);
    if (fallback) setActiveSwapFood(fallback);
  };

  // Helper to pick contextual food icons
  const getDishEmoji = (name: string, cat: string) => {
    const n = name.toLowerCase();
    if (n.includes('strawberry')) return '🍓';
    if (n.includes('jamun') || n.includes('mulberry') || n.includes('shahtoot') || n.includes('phalsa') || n.includes('berry') || n.includes('berries') || n.includes('rasbhari')) return '🫐';
    if (n.includes('pineapple') || n.includes('ananas')) return '🍍';
    if (n.includes('orange') || n.includes('santra') || n.includes('kinnow') || n.includes('mosambi') || n.includes('citrus')) return '🍊';
    if (n.includes('mango') || n.includes('aam') || n.includes('kairi') || n.includes('alphonso') || n.includes('dasheri') || n.includes('kesar')) return '🥭';
    if (n.includes('grape') || n.includes('angoor') || n.includes('draksh') || n.includes('sonaka')) return '🍇';
    if (n.includes('watermelon') || n.includes('tarbooz') || n.includes('kharbuja') || n.includes('melon')) return '🍉';
    if (n.includes('pomegranate') || n.includes('anaar')) return '🍎';
    if (n.includes('pear') || n.includes('nashpati') || n.includes('babbugosha')) return '🍐';
    if (n.includes('fruit') || n.includes('papaya') || n.includes('apple') || n.includes('guava') || n.includes('chikoo') || n.includes('amla') || n.includes('ber') || n.includes('sitaphal')) return '🍎';
    if (n.includes('chilla')) return '🥞';
    if (n.includes('poha')) return '🥣';
    if (n.includes('upma') || n.includes('dalia')) return '🍲';
    if (n.includes('idli') || n.includes('dosa')) return '🥟';
    if (n.includes('egg') || n.includes('omelette')) return '🍳';
    if (n.includes('chicken')) return '🍗';
    if (n.includes('fish')) return '🐟';
    if (n.includes('paneer') || n.includes('tofu')) return '🧀';
    if (n.includes('dal') || n.includes('rajma') || n.includes('chole') || n.includes('kadhi')) return '🍛';
    if (n.includes('khichdi')) return '🍲';
    if (n.includes('roti') || n.includes('thepla') || n.includes('phulka')) return '🫓';
    if (n.includes('chai') || n.includes('tea') || n.includes('coffee')) return '☕';
    if (n.includes('chaas') || n.includes('buttermilk') || n.includes('cooler') || n.includes('coconut')) return '🥥';
    if (n.includes('makhana') || n.includes('chana') || n.includes('almond') || n.includes('nuts')) return '🥜';
    if (n.includes('sprout') || n.includes('salad') || n.includes('kachumber')) return '🥗';
    if (cat === 'Breakfast') return '🌅';
    if (cat === 'PreLunch') return '🥗';
    if (cat === 'Lunch') return '🍛';
    if (cat === 'Dinner') return '🌙';
    return '🍽️';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header with Indian Wellness Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 border-b border-stone-800 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HealthArogyaa Meal Selection</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-400 font-normal">Filtered for {userProfile.dietPreference}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
              {activeCategory === 'PreLunch' ? 'Pre-Lunch: Fruits & Salads' : `Choose Your ${activeCategory}`}
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              {activeCategory === 'PreLunch'
                ? 'Eat 1 bowl of fresh salad and 1–3 seasonal fruits 15–30 min before lunch to optimize satiety and enzymes.'
                : "Don't follow a diet chart. Pick what you love within your calorie target."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors relative z-10 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-100/90 border-b border-stone-200 overflow-x-auto text-xs font-semibold">
          <span className="text-stone-500 text-[11px] uppercase tracking-wider font-bold mr-1 shrink-0">
            Categories:
          </span>
          {[
            { id: 'Breakfast' as MealCategory, label: '🌅 Breakfast' },
            { id: 'PreLunch' as MealCategory, label: '🥗 Pre-Lunch' },
            { id: 'Lunch' as MealCategory, label: '🍛 Lunch' },
            { id: 'Dinner' as MealCategory, label: '🌙 Dinner' },
            { id: 'Snacks' as MealCategory, label: '☕ Snacks & Beverages' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id);
                setSearchQuery('');
                setActiveFilterTag('all');
                setSelectedFood(null);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-semibold cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/90 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Engaging Filter Pills Bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 space-y-3">
          {/* Pre-Lunch Choice Helper Box */}
          {activeCategory === 'PreLunch' && (
            <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥗🍊</span>
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                    Pre-Lunch Choice: Seasonal Fruits or Fresh Salad
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Eat 1 bowl of salad and 1–3 seasonal fruits 15–30 min before lunch to control appetite.
                  </p>
                </div>
              </div>

              {/* Direct Choice Buttons */}
              <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                <button
                  onClick={() => setActiveFilterTag('seasonal_fruits')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    activeFilterTag === 'seasonal_fruits'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <span>🍊</span>
                  <span>Fruits Only ({seasonalFruitsCount})</span>
                </button>
                <button
                  onClick={() => setActiveFilterTag('salads')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    activeFilterTag === 'salads'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <span>🥗</span>
                  <span>Salad Only ({saladsCount})</span>
                </button>
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder={
                activeCategory === 'PreLunch'
                  ? 'Search seasonal fruits & salads (e.g. Orange, Mango, Grapes, Papaya, Kachumber, Guava)...'
                  : activeCategory === 'Snacks'
                  ? 'Search snacks & seasonal fruits (e.g. Mango, Grapes, Orange, Jamun, Strawberry, Makhana, Chana)...'
                  : `Search ${activeCategory} (e.g. Chilla, Poha, Dal, Roti, Khichdi, Chicken)...`
              }
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs transition-all"
            />
          </div>

          {/* Snacks Fruit Choice Helper Box */}
          {activeCategory === 'Snacks' && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥭🍇🍊</span>
                <div>
                  <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                    Healthy Snack Choice: Fresh Seasonal Indian Fruits
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Savor seasonal Indian fruits (Mango, Grapes, Orange, Jamun, Strawberries &amp; Berries) for a light, high-fibre sweet craving fix under 90 kcal.
                  </p>
                </div>
              </div>

              {/* Direct Choice Button */}
              <button
                onClick={() => setActiveFilterTag(activeFilterTag === 'seasonal_fruits' ? 'all' : 'seasonal_fruits')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeFilterTag === 'seasonal_fruits' || activeFilterTag.startsWith('fruit_')
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-stone-800 border border-amber-300 hover:bg-amber-100/60'
                }`}
              >
                <span>🍎</span>
                <span>Fruits Only ({seasonalFruitsCount})</span>
              </button>
            </div>
          )}

          {/* Attractive Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {activeCategory === 'PreLunch' ? (
              <>
                <button
                  onClick={() => setActiveFilterTag('all')}
                  className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    activeFilterTag === 'all'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  All Pre-Lunch ({baseList.length})
                </button>

                <button
                  onClick={() => setActiveFilterTag('seasonal_fruits')}
                  className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeFilterTag === 'seasonal_fruits'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <span>🍊</span>
                  <span>Seasonal Fruits ({seasonalFruitsCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('fruit_mango')}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'fruit_mango'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                      : 'bg-amber-50/80 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span>🥭</span>
                  <span>Mangoes ({mangoCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('fruit_grapes')}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'fruit_grapes'
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'bg-purple-50/80 text-purple-900 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  <span>🍇</span>
                  <span>Grapes ({grapesCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('fruit_orange')}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'fruit_orange'
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'bg-orange-50/80 text-orange-900 border border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  <span>🍊</span>
                  <span>Oranges &amp; Citrus ({orangeCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('salads')}
                  className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeFilterTag === 'salads'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <span>🥗</span>
                  <span>Fresh Salads &amp; Kachumber ({saladsCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('sprouts')}
                  className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeFilterTag === 'sprouts'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-teal-200 hover:bg-teal-50'
                  }`}
                >
                  <span>🌱</span>
                  <span>Sprouts &amp; Medleys</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('under_100')}
                  className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    activeFilterTag === 'under_100'
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  ⚡ Under 80 kcal
                </button>
              </>
            ) : activeCategory === 'Snacks' ? (
              <>
                <button
                  onClick={() => setActiveFilterTag('all')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    activeFilterTag === 'all'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  All Snacks ({baseList.length})
                </button>

                <button
                  onClick={() => setActiveFilterTag('seasonal_fruits')}
                  className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeFilterTag === 'seasonal_fruits'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-800 border border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <span>🍎</span>
                  <span>All Seasonal Fruits ({seasonalFruitsCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('fruit_mango')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'fruit_mango'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                      : 'bg-amber-50/90 text-amber-950 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span>🥭</span>
                  <span>Mangoes ({mangoCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('fruit_grapes')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'fruit_grapes'
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'bg-purple-50/90 text-purple-950 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  <span>🍇</span>
                  <span>Grapes ({grapesCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('fruit_orange')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'fruit_orange'
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'bg-orange-50/90 text-orange-950 border border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  <span>🍊</span>
                  <span>Oranges &amp; Citrus ({orangeCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('fruit_berries')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'fruit_berries'
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'bg-rose-50/90 text-rose-950 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <span>🫐</span>
                  <span>Berries &amp; Jamun ({berriesCount})</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('high_protein')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'high_protein'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-emerald-50'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>High Protein</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('low_gi')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'low_gi'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-emerald-50'
                  }`}
                >
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  <span>Low GI</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('under_100')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    activeFilterTag === 'under_100'
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  ⚡ Under 80 kcal
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveFilterTag('all')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    activeFilterTag === 'all'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  All Items ({baseList.length})
                </button>

                <button
                  onClick={() => setActiveFilterTag('high_protein')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'high_protein'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-emerald-50'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>High Protein (&ge;14g)</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('low_gi')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'low_gi'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-emerald-50'
                  }`}
                >
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  <span>Low Glycemic Index</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('roti')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeFilterTag === 'roti'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Wheat className="w-3 h-3 text-amber-600" />
                  <span>Roti Combos</span>
                </button>

                <button
                  onClick={() => setActiveFilterTag('rice')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    activeFilterTag === 'rice'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Rice &amp; Khichdi
                </button>

                <button
                  onClick={() => setActiveFilterTag('combos')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    activeFilterTag === 'combos'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Balanced Thalis &amp; Combos
                </button>

                <button
                  onClick={() => setActiveFilterTag('light')}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                    activeFilterTag === 'light'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Under 300 kcal
                </button>
              </>
            )}
          </div>

          {/* Toggle between Recommended vs All Category Foods */}
          <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
            <span className="font-medium text-stone-700">
              {showAllOptions
                ? `Showing all ${filteredFoods.length} choices in ${activeCategory}`
                : `Top ${filteredFoods.length} personalized recommendations`}
            </span>

            <button
              onClick={() => setShowAllOptions(!showAllOptions)}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              <span>{showAllOptions ? 'Show Recommended Only' : 'See All Options'}</span>
              {showAllOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Engaging Foods Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 bg-stone-100/50">
          {filteredFoods.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-sm bg-white rounded-2xl border border-stone-200">
              <Utensils className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="font-semibold text-stone-700">No matching foods found</p>
              <p className="text-xs text-stone-400 mt-1">Try resetting the filter chips or search query.</p>
            </div>
          ) : (
            filteredFoods.map(food => {
              const reason = reasonMap[food.id];
              const isSelected = selectedFood?.id === food.id;
              const emoji = getDishEmoji(food.name, food.category);

              // Macro percentages for visual ratio bar
              const totalMacros = (food.protein * 4) + (food.carbs * 4) + (food.fat * 9) || 1;
              const proteinPct = Math.round(((food.protein * 4) / totalMacros) * 100);
              const carbsPct = Math.round(((food.carbs * 4) / totalMacros) * 100);
              const fatPct = Math.round(((food.fat * 9) / totalMacros) * 100);

              return (
                <div
                  key={food.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md'
                      : 'border-stone-200/90 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Dish visual icon and details */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Food Avatar */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-stone-200/60 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                          {emoji}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          {/* Dish Title & Veg/Non-Veg icon */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Indian Standard Veg/Non-Veg symbol */}
                            <span
                              className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 ${
                                food.vegetarian ? 'border-emerald-600' : 'border-rose-600'
                              }`}
                              title={food.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  food.vegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              />
                            </span>

                            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                              {food.name}
                            </h3>

                            {food.hindiName && (
                              <span className="text-xs text-stone-400 font-medium">
                                ({food.hindiName})
                              </span>
                            )}
                          </div>

                          {/* Serving specification */}
                          <div className="text-xs text-stone-600">
                            Serving: <strong className="text-stone-800">{food.serving}</strong>
                          </div>

                          {/* Recommendation reason */}
                          {reason && !showAllOptions && (
                            <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                              ✓ {reason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Calories & Select Button */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0 pl-1">
                        <div className="text-right">
                          <span className="text-base sm:text-xl font-extrabold text-stone-900 tabular-nums font-display whitespace-nowrap">
                            {food.calories}
                          </span>
                          <span className="text-[10px] text-stone-500 block font-normal uppercase leading-tight">
                            kcal
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedFood(isSelected ? null : food)}
                          className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                            isSelected
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-stone-900 text-white hover:bg-stone-800'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'Selected' : 'Select'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Nutritional Specs & Macro Proportion Bar */}
                    <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-2">
                      <div className="flex items-center justify-between text-xs text-stone-600 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">
                            P: {food.protein}g
                          </span>
                          <span className="text-stone-300">·</span>
                          <span>C: {food.carbs}g</span>
                          <span className="text-stone-300">·</span>
                          <span>F: {food.fat}g</span>
                          <span className="text-stone-300">·</span>
                          <span className="text-emerald-700 font-medium">Fibre: {food.fibre}g</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            food.gi === 'Low'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : food.gi === 'Medium'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {food.gi} GI · GL {food.gl}
                          </span>

                          {/* Smart Swap Button */}
                          <button
                            onClick={() => handleOpenSwap(food)}
                            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Swap</span>
                          </button>
                        </div>
                      </div>

                      {/* Visual Macro Energy Distribution Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-1.5 rounded-full overflow-hidden bg-stone-100 flex">
                          <div style={{ width: `${proteinPct}%` }} className="bg-emerald-500" title={`Protein: ${proteinPct}%`} />
                          <div style={{ width: `${carbsPct}%` }} className="bg-amber-400" title={`Carbohydrates: ${carbsPct}%`} />
                          <div style={{ width: `${fatPct}%` }} className="bg-stone-400" title={`Fats: ${fatPct}%`} />
                        </div>
                        <div className="flex justify-between text-[9px] text-stone-400">
                          <span>{proteinPct}% Protein</span>
                          <span>{carbsPct}% Carbs</span>
                          <span>{fatPct}% Fats</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Portion & Log Action Drawer */}
                  {isSelected && (
                    <div className="p-4 bg-emerald-50/70 border-t border-emerald-200/80 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-emerald-950 block">
                            Select Serving Quantity:
                          </span>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {[
                              { label: '0.5x', sub: 'Half', val: 0.5 },
                              { label: '1.0x', sub: 'Std', val: 1 },
                              { label: '1.5x', sub: 'Hearty', val: 1.5 },
                              { label: '2.0x', sub: 'Double', val: 2 },
                            ].map(p => (
                              <button
                                key={p.val}
                                onClick={() => setPortionMultiplier(p.val)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  portionMultiplier === p.val
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : 'bg-white text-stone-700 border border-emerald-200 hover:bg-emerald-100'
                                }`}
                              >
                                {p.label} <span className="text-[10px] font-normal opacity-80">({p.sub})</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Calculated total & Add CTA */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-200/50">
                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-lg sm:text-xl font-extrabold text-stone-900 tabular-nums font-display whitespace-nowrap">
                              {Math.round(food.calories * portionMultiplier)} kcal
                            </span>
                            <span className="text-[10px] text-stone-500 block leading-tight">
                              P: {Math.round(food.protein * portionMultiplier)}g · C: {Math.round(food.carbs * portionMultiplier)}g
                            </span>
                          </div>

                          <button
                            onClick={() => handleAdd(food)}
                            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Check className="w-4 h-4" />
                            <span>Add to {activeCategory}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Smart Swap Drawer */}
        {activeSwapFood && (
          <div className="p-4 bg-emerald-50 border-t border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-emerald-700" />
                HealthArogyaa Smart Swap Suggestion
              </span>
              <button
                onClick={() => setActiveSwapFood(null)}
                className="text-emerald-800 hover:text-emerald-950 text-xs font-semibold"
              >
                Close
              </button>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <span className="font-bold text-stone-900 text-sm">
                  {activeSwapFood.name}
                </span>
                <p className="text-xs text-stone-600">
                  Serving: {activeSwapFood.serving} · <strong>{activeSwapFood.calories} kcal</strong> · Protein: {activeSwapFood.protein}g · Fibre: {activeSwapFood.fibre}g
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Benefit: Richer in plant protein and lower glycemic load to stabilize insulin.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedFood(activeSwapFood);
                  setActiveSwapFood(null);
                }}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 shrink-0 self-start sm:self-center"
              >
                Choose This Swap
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Philosophy: "Don't follow a diet chart. Choose your food."</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

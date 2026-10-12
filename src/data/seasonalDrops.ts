import { SeasonalDrop } from '../types';

export const SEASONAL_DROPS: SeasonalDrop[] = [
  {
    id: 'festive-buffering',
    title: 'Festive Indulgence & Calorie Buffering Guide',
    seasonName: 'Festive Season (Navratri, Diwali, Eid)',
    tagline: 'Enjoy celebrations without gaining fat with the 80/20 buffer strategy',
    bannerEmoji: '🪔✨',
    themeColor: 'amber',
    keyBenefits: [
      'Zero deprivation during family celebrations',
      'Blood sugar stabilization prevents post-sweet lethargy',
      'Pre-party high protein buffering protects your weekly calorie budget',
    ],
    recommendedFoods: [
      {
        name: 'Roasted Makhana & Almond Trail Mix',
        portion: '1 bowl (40g)',
        calories: 140,
        benefits: 'High satiety crunch, prevents mindless sweet snacking at family gatherings',
      },
      {
        name: 'Grilled Paneer Tikka with Mint Chutney',
        portion: '4 cubes (120g)',
        calories: 220,
        benefits: '16g protein anchor before going to festive dinners',
      },
      {
        name: 'Besan Laddoo (Smart Portion)',
        portion: '1 small piece (25g)',
        calories: 120,
        benefits: 'Satisfies festival sweet craving when paired with warm green tea',
      },
      {
        name: 'Spiced Buttermilk with Jeera & Mint',
        portion: '1 large glass (250ml)',
        calories: 45,
        benefits: 'Aids digestive enzyme secretion after rich festive foods',
      },
    ],
    swaps: [
      {
        avoid: 'Fried Samosa & Kachori (320 kcal, high trans fat)',
        choose: 'Tandoori / Air-fried Paneer Tikka (180 kcal, 14g protein)',
        reason: 'Saves 140 kcal and provides 4x more satiety to prevent late-night binging',
      },
      {
        avoid: 'Gulab Jamun dipped in sugar syrup (300 kcal/pair)',
        choose: '1 piece Sandesh or Kaju Katli (80-110 kcal)',
        reason: 'Dense milk/nut sweetness with 60% lower glycemic spike',
      },
      {
        avoid: 'Bottled soft drinks / mocktails (150 kcal pure sugar)',
        choose: 'Chilled Jaljeera or Mint Chaas (35 kcal)',
        reason: 'Replaces refined sugar with digestive spices that eliminate bloating',
      },
    ],
    lifestyleTip:
      'The 80/20 Festive Rule: On celebration days, eat lean protein and high-fiber raw salad during breakfast and pre-lunch. This creates a 350-400 kcal safety buffer so you can comfortably enjoy evening festival treats without fat gain.',
  },
  {
    id: 'summer-hydration',
    title: 'Summer Hydration & Thermoregulation Drop',
    seasonName: 'Summer & Heat Waves',
    tagline: 'Beat water retention, afternoon brain fog, and dehydration cravings',
    bannerEmoji: '🍉☀️',
    themeColor: 'emerald',
    keyBenefits: [
      'Eliminates false hunger triggered by dehydration',
      'Provides natural electrolytes (potassium & magnesium) without sugar',
      'Low caloric density fills stomach with enzyme-rich fruit water',
    ],
    recommendedFoods: [
      {
        name: 'Fresh Tarbooz (Watermelon) Chaat with Mint & Kala Namak',
        portion: '1 large bowl (200g)',
        calories: 60,
        benefits: '92% water volume, high lycopene, curbs sweet cravings under 70 kcal',
      },
      {
        name: 'Kharbooza (Muskmelon) Pre-Lunch Bowl',
        portion: '1 bowl (180g)',
        calories: 62,
        benefits: 'Rich in vitamin C, stimulates digestive juices before cooked lunch',
      },
      {
        name: 'Roasted Chana Sattu Cooler (Namkeen)',
        portion: '1 glass (30g sattu in 300ml chilled water)',
        calories: 125,
        benefits: '7.5g plant protein, lowers core body heat and provides sustained energy',
      },
      {
        name: 'Cucumber & Tomato Kachumber with Lemon Dressing',
        portion: '1 deep bowl (150g)',
        calories: 32,
        benefits: 'High dietary fiber, zero glycemic impact, delays gastric emptying',
      },
    ],
    swaps: [
      {
        avoid: 'Cold Sweetened Cold Drinks / Ice Creams (240 kcal)',
        choose: 'Fresh Chilled Chaas with Roasted Cumin (45 kcal)',
        reason: 'Restores gut microflora and electrolytes without a reactive insulin crash',
      },
      {
        avoid: 'Heavy Cream-based Gravies / Fried Pakoras',
        choose: 'Moong Dal Chilla with Green Chutney (160 kcal, 8g protein)',
        reason: 'Light on summer digestion and provides sustained amino acids',
      },
    ],
    lifestyleTip:
      'Drink 500ml of water 30 minutes before your meals. Summer thirst centers in the brain frequently mimic hunger, leading to unnecessary mid-afternoon overeating.',
  },
  {
    id: 'winter-thermogenic',
    title: 'Winter Metabolic Warming Recipes',
    seasonName: 'Winter Wellness',
    tagline: 'Harness cold thermogenesis with warming Indian spices and unrefined grains',
    bannerEmoji: '🍲❄️',
    themeColor: 'rose',
    keyBenefits: [
      'Natural thermogenic spices increase resting calorie burn',
      'Complex unrefined millets (Bajra, Jowar) regulate winter blood sugar',
      'Sustained warmth prevents seasonal carbohydrate cravings',
    ],
    recommendedFoods: [
      {
        name: 'Sarson ka Saag (Measured Ghee)',
        portion: '1 medium katori (150g) with 1/2 tsp pure ghee',
        calories: 135,
        benefits: 'Dense micronutrients, chlorophyll, and warming dietary nitrates',
      },
      {
        name: 'Bajra Roti with Methi Leaves',
        portion: '1 medium roti (40g flour)',
        calories: 145,
        benefits: 'Slow-digesting magnesium-rich millet prevents winter sluggishness',
      },
      {
        name: 'Spiced Ginger Moong Dal Soup',
        portion: '1 large bowl (250ml)',
        calories: 160,
        benefits: '9g protein with ginger and black pepper for metabolic warmth',
      },
    ],
    swaps: [
      {
        avoid: 'Gajar Ka Halwa with heavy khoya (380 kcal/serving)',
        choose: 'Warm Steamed Carrot & Beetroot with a sprinkle of crushed almonds (95 kcal)',
        reason: 'Rich in vitamin A and natural sweetness with 75% fewer calories',
      },
    ],
    lifestyleTip:
      'Add fresh ginger, black pepper, and cinnamon to your morning warm water. They contain thermogenic gingerols that gently boost circulation and energy in cold weather.',
  },
];

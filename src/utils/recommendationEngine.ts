import { FoodItem, UserProfile, MealCategory } from '../types';

export interface RecommendationResult {
  recommended: FoodItem[];
  allCategoryFoods: FoodItem[];
  reasonMap: Record<string, string>;
}

export function getRecommendedFoods(
  allFoods: FoodItem[],
  userProfile: UserProfile,
  category: MealCategory
): RecommendationResult {
  // 1. Filter to active items in category (also allow seasonal fruits in PreLunch)
  const categoryFoods = allFoods.filter(f => {
    if (!f.active) return false;
    if (f.category === category) return true;
    if (category === 'PreLunch' && (f.tags.includes('Seasonal Fruits') || f.tags.includes('Fruit'))) return true;
    return false;
  });

  // 2. Strict diet filter
  const dietFiltered = categoryFoods.filter(food => {
    // Diet preference check
    if (userProfile.dietPreference === 'Vegan') {
      if (food.dietType !== 'Vegan') return false;
    } else if (userProfile.dietPreference === 'Veg') {
      if (food.dietType === 'Non-Veg' || food.dietType === 'Eggetarian') return false;
    } else if (userProfile.dietPreference === 'Eggetarian') {
      if (food.dietType === 'Non-Veg') return false;
    }

    // Disliked ingredients check (e.g. paneer, dairy, etc.)
    const foodNameLower = food.name.toLowerCase();
    const tagsLower = food.tags.map(t => t.toLowerCase());

    for (const dislike of userProfile.dislikes) {
      const d = dislike.trim().toLowerCase();
      if (!d) continue;
      if (foodNameLower.includes(d)) return false;
      if (tagsLower.some(t => t.includes(d))) return false;
    }

    return true;
  });

  // 3. Intelligent scoring algorithm
  const reasonMap: Record<string, string> = {};

  const scored = dietFiltered.map(food => {
    let score = 50; // base score
    const reasons: string[] = [];

    // Goal alignment (Weight Loss)
    if (userProfile.goal === 'weight_loss' || userProfile.goal === 'mild_weight_loss') {
      if (food.protein >= 14) {
        score += 25;
        reasons.push('High satiety protein');
      }
      if (food.fibre >= 6) {
        score += 20;
        reasons.push('Rich dietary fibre');
      }
      if (food.gi === 'Low') {
        score += 20;
        reasons.push('Low glycemic index');
      }
    }

    // Grain preference alignment (Roti vs Rice vs Millets)
    const hasRoti = food.tags.includes('Roti') || food.name.toLowerCase().includes('roti') || food.name.toLowerCase().includes('phulka') || food.name.toLowerCase().includes('thepla');
    const hasRice = food.tags.includes('Rice') || food.name.toLowerCase().includes('rice') || food.name.toLowerCase().includes('poha') || food.name.toLowerCase().includes('khichdi');

    if (userProfile.likesRoti && hasRoti) {
      score += 25;
      reasons.push('Matches your roti preference');
    }
    if (!userProfile.likesRoti && hasRoti) {
      score -= 30; // Deprioritize if user doesn't like roti
    }

    if (userProfile.likesRice && hasRice) {
      score += 20;
      reasons.push('Matches your rice preference');
    }
    if (!userProfile.likesRice && hasRice) {
      score -= 25;
    }

    // High protein tag
    if (food.tags.includes('High Protein')) {
      score += 15;
    }

    // Combo meal practicality
    if (food.isCombo) {
      score += 10;
      reasons.push('Complete balanced meal combo');
    }

    // Seasonal Fruit Intelligence for Snacks & PreLunch
    const isFruit =
      food.tags.includes('Fruit') ||
      food.tags.includes('Seasonal Fruits') ||
      food.name.toLowerCase().includes('mango') ||
      food.name.toLowerCase().includes('grape') ||
      food.name.toLowerCase().includes('orange') ||
      food.name.toLowerCase().includes('berry') ||
      food.name.toLowerCase().includes('berries') ||
      food.name.toLowerCase().includes('jamun') ||
      food.name.toLowerCase().includes('strawberry') ||
      food.name.toLowerCase().includes('guava') ||
      food.name.toLowerCase().includes('papaya') ||
      food.name.toLowerCase().includes('amla') ||
      food.name.toLowerCase().includes('melon') ||
      food.name.toLowerCase().includes('ber ') ||
      food.name.toLowerCase().includes('phalsa');

    if ((category === 'Snacks' || category === 'PreLunch') && isFruit) {
      score += 30; // Boost seasonal fruits as clean wholesome snacking
      if (food.gi === 'Low') {
        score += 15;
        reasons.push('Low GI antioxidant-rich Indian fruit');
      } else {
        reasons.push('Real seasonal Indian fruit delicacy');
      }
      if (food.calories <= 90) {
        score += 10;
        reasons.push('Under 90 kcal natural craving killer');
      }
      if (food.tags.includes('Berries') || food.name.toLowerCase().includes('jamun') || food.name.toLowerCase().includes('berry')) {
        score += 10;
        reasons.push('Rich in anti-inflammatory anthocyanins');
      }
      if (food.tags.includes('Orange') || food.tags.includes('Vitamin C') || food.name.toLowerCase().includes('santra')) {
        reasons.push('100% daily Vitamin C immunity');
      }
    }

    reasonMap[food.id] = reasons.slice(0, 2).join(' · ') || 'Balanced Indian nutritional profile';

    return {
      food,
      score,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const sortedFoods = scored.map(s => s.food);
  const recommended = sortedFoods.slice(0, 8); // Top 6-8 recommendations

  return {
    recommended,
    allCategoryFoods: sortedFoods,
    reasonMap,
  };
}

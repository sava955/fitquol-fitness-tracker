import { Meal } from '../../core/models/meals/meal.interface';
import { NutrientData } from '../../core/models/nutrients/nutrient.interface';

export function calculateNutritientsForQuantity(meal: Meal, quantity: number) {
  if (quantity === 0) {
    return;
  }

  const nutrients = {
    calories: meal.nutrients.calories,
    macronutrients: [...meal.nutrients.macronutrients],
    micronutrients: [...meal.nutrients.micronutrients],
  };

  nutrients.calories = Number(
    ((meal.nutrients.calories * quantity) / meal.quantity)
  );

  meal.nutrients.macronutrients.forEach((macronutrient: NutrientData) => {
    const baseValue = macronutrient.value / meal.quantity;

    const value = baseValue * quantity;

    const dailyLimit = macronutrient.dailyLimit;

    const percentageOfTotal =
      dailyLimit > 0 ? (value / dailyLimit) * 100 : 0;

    let macronutrientIndex = nutrients.macronutrients.findIndex(
      (nutrient: NutrientData) => nutrient.key === macronutrient.key
    );
    nutrients.macronutrients[macronutrientIndex] = {
      ...nutrients.macronutrients[macronutrientIndex],
      value: value,
      percentageOfTotal: percentageOfTotal,
    };
  });

  meal.nutrients.micronutrients.forEach((micronutrient: NutrientData) => {
    const baseValue = micronutrient.value / meal.quantity;

    const value = baseValue * quantity;

    const dailyLimit = micronutrient.dailyLimit;

    const percentageOfTotal =
      dailyLimit > 0 ? (value / dailyLimit) * 100 : 0;

    let micronutrientIndex = nutrients.micronutrients.findIndex(
      (nutrient: NutrientData) => nutrient.key === micronutrient.key
    );
    nutrients.micronutrients[micronutrientIndex] = {
      ...nutrients.micronutrients[micronutrientIndex],
      value: value,
      percentageOfTotal: percentageOfTotal,
    };
  });

  return nutrients;
}

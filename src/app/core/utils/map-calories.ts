type HasNutrients = {
  nutrients: {
    calories: number;
  };
};

export function mapCalories<T extends HasNutrients>(
  data: T
): T & { calories: number } {
  return {
    ...data,
    calories: data.nutrients.calories,
  };
}

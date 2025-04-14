import { macronutrientsDataArr } from '../../core/const/meals/macronutrients';
import { NutrientData } from '../../core/models/nutrients/nutrient.interface';

export function setMacronutrients(nutrients: any, macronutrients: any): NutrientData[] {
  const macronutrientsKeys = new Set(Object.keys(macronutrients));
  const macronutrientsData = macronutrientsDataArr;
  let data = [];

  for (let key of macronutrientsKeys) {
    const macronutrientsDataItem = macronutrientsData.find(
      (item) => item.key === key
    );

    if (macronutrientsDataItem) {
      macronutrientsDataItem.value = nutrients[key]
        ? parseFloat(nutrients[key])
        : 0;
      macronutrientsDataItem.percentageOfTotal =
        nutrients[key] && macronutrients[key]
          ? Number(
              (nutrients[key] / macronutrients[key]) * 100
            )
          : 0;
      macronutrientsDataItem.dailyLimit = parseFloat(
        macronutrients[key]
      );

      data.push(macronutrientsDataItem);
    }
  }

  return data;
}

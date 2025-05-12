import { macronutrientsDataArr } from '../../features/diary/const/macronutrients.const';
import { Macronutrients, NutrientData } from '../models/nutrient.interface';

export function setMacronutrients(nutrients: Macronutrients, macronutrients: Macronutrients): NutrientData[] {
  const macronutrientsKeys = new Set(Object.keys(macronutrients) as (keyof Macronutrients)[]);
  const macronutrientsData = macronutrientsDataArr;
  let data = [];

  for (let key of macronutrientsKeys) {
    const macronutrientsDataItem = macronutrientsData.find(
      (item) => item.key === key
    );

    if (macronutrientsDataItem) {
      const nutrientValue = nutrients[key] ?? 0;
      const dailyLimit = macronutrients[key] ?? 0;

      macronutrientsDataItem.value = nutrientValue;
      
      macronutrientsDataItem.percentageOfTotal =
        nutrients[key] && macronutrients[key]
          ? Number(
              (nutrients[key] / macronutrients[key]) * 100
            )
          : 0;
      macronutrientsDataItem.dailyLimit = dailyLimit;

      data.push(macronutrientsDataItem);
    }
  }

  return data;
}

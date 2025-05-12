import { micronutrientsDataArr } from '../../features/diary/const/micronutrients.const';
import { Micronutrients, NutrientData } from '../models/nutrient.interface';

export function setMicronutrients(nutrients: Micronutrients, micronutrients: Micronutrients): NutrientData[] {
  const micronutrientsKeys = new Set(Object.keys(micronutrients) as (keyof Micronutrients)[]);
  const micronutrientsData = micronutrientsDataArr;
  let data = [];

  for (let key of micronutrientsKeys) {
    const micronutrientsDataItem = micronutrientsData.find(
      (item) => item.key === key
    );

    if (micronutrientsDataItem) {
      const nutrientValue = nutrients[key] ?? 0;
      const dailyLimit = micronutrients[key] ?? 0;

      micronutrientsDataItem.value = nutrientValue;
      
      micronutrientsDataItem.percentageOfTotal =
        nutrients[key] && micronutrients[key]
          ? Number(
              (nutrients[key] / micronutrients[key]) * 100
            )
          : 0;
      micronutrientsDataItem.dailyLimit = dailyLimit;

      data.push(micronutrientsDataItem);
    }
  }

  return data;
}

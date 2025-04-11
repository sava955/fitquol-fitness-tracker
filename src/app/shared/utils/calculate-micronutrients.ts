import { micronutrientsDataArr } from '../../core/const/meals/micronutrients';

export function setMicronutrients(nutrients: any, micronutrients: any) {
  const micronutrientsKeys = new Set(Object.keys(micronutrients));
  const micronutrientsData = micronutrientsDataArr;
  let data = [];

  for (let key of micronutrientsKeys) {
    const micronutrientsDataItem = micronutrientsData.find(
      (item) => item.key === key
    );

    if (micronutrientsDataItem) {
      micronutrientsDataItem.value = nutrients[key]
        ? parseFloat(nutrients[key])
        : 0;
      micronutrientsDataItem.percentageOfTotal =
        nutrients[key] && micronutrients[key]
          ? Number(
              (nutrients[key] / micronutrients[key]) * 100
            )
          : 0;
      micronutrientsDataItem.dailyLimit = parseFloat(
        micronutrients[key]
      );

      data.push(micronutrientsDataItem);
    }
  }

  return data;
}

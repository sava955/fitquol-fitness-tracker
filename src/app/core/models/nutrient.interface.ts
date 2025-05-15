export interface Nutrients {
  calories: number;
  macronutrients: NutrientData[];
  micronutrients: NutrientData[];
}

export interface NutrientData {
  name: string;
  key: string;
  value: number;
  unitOfMeasurement: string;
  percentageOfTotal: number;
  dailyLimit: number;
}

export interface PlainNutrients extends Macronutrients, Micronutrients {
  calories: number;
}

export interface Macronutrients {
  calories?: number;
  carbohydrates?: number;
  protein?: number;
  fats?: number;
  net_carbs?: number;
  fiber?: number;
  saturated?: number;
  mufa?: number;
  pufa?: number;
  pufa_w3?: number;
  pufa_w6?: number;
}

export interface Micronutrients {
  vit_a_rae?: number;
  vit_a?: number;
  vit_b1?: number;
  vit_b2?: number;
  vit_b3?: number;
  vit_b5?: number;
  vit_b6?: number;
  vit_b9?: number;
  vit_b12?: number;
  vit_c?: number;
  vit_d?: number;
  vit_e?: number;
  vit_k?: number;
  choline?: number;
  betaine?: number;
  calcium?: number;
  copper?: number;
  fluoride?: number;
  iron?: number;
  magnesium?: number;
  manganese?: number;
  phosphorus?: number;
  potassium?: number;
  selenium?: number;
  sodium?: number;
  zinc?: number;
}

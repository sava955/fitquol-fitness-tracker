export interface Diet {
  dailyCalories: number;
  macronutrients: {
    carbohydrates: number;
    net_carbs: number;
    fiber: number;
    fats: number;
    saturated: number;
    mufa: number;
    pufa: number;
    pufa_w6: number;
    pufa_w3: number;
    protein: number;
  };
  micronutrients: {
    vit_a_rae: number;
    vit_a: number;
    vit_c: number;
    vit_d: number;
    vit_e: number;
    vit_k: number;
    vit_b1: number;
    vit_b2: number;
    vit_b3: number;
    vit_b5: number;
    vit_b6: number;
    vit_b9: number;
    vit_b12: number;
    choline: number;
    betaine: number;
    calcium: number;
    copper: number;
    fluoride: number;
    iron: number;
    magnesium: number;
    manganese: number;
    phosphorus: number;
    potassium: number;
    selenium: number;
    sodium: number;
    zinc: number;
  };
  user: string;
}

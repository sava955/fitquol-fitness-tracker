export function convertImperialToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

export function convertCmToImperial(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function convertKgToPounds(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function convertPoundsToKg(pounds: number): number {
  return Math.round((pounds / 2.20462) * 10) / 10;
}

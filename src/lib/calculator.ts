export type WeightUnit = "g" | "kg";
export type VolumeUnit = "ml" | "L";
export type Unit = WeightUnit | VolumeUnit;

export function normalizeToBase(value: number, unit: Unit): number {
  if (unit === "kg") return value * 1000;
  if (unit === "L") return value * 1000;
  return value;
}

export function calculate(
  price: number,
  packageWeight: number,
  packageUnit: Unit,
  doseSize: number,
  doseUnit: Unit,
  bonus?: number,
) {
  const totalWeight = normalizeToBase(packageWeight, packageUnit) + (bonus ?? 0);
  const effectiveDose = normalizeToBase(doseSize, doseUnit);

  if (effectiveDose <= 0) {
    return { totalDoses: 0, costPerDose: 0 };
  }

  const totalDoses = totalWeight / effectiveDose;
  const costPerDose = price / totalDoses;

  return {
    totalDoses: Math.floor(totalDoses * 100) / 100,
    costPerDose: Math.round(costPerDose * 100) / 100,
  };
}

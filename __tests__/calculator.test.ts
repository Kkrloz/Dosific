import { describe, it, expect } from "vitest";
import { calculate } from "@/lib/calculator";

describe("calculate", () => {
  it("900g com dose de 30g rende 30 doses", () => {
    const result = calculate(100, 900, "g", 30, "g");
    expect(result.totalDoses).toBe(30);
    expect(result.costPerDose).toBeCloseTo(3.33, 2);
  });

  it("converte kg para g corretamente", () => {
    const result = calculate(200, 1, "kg", 50, "g");
    expect(result.totalDoses).toBe(20);
    expect(result.costPerDose).toBe(10);
  });

  it("converte L para ml corretamente", () => {
    const result = calculate(50, 1, "L", 5, "ml");
    expect(result.totalDoses).toBe(200);
    expect(result.costPerDose).toBeCloseTo(0.25, 2);
  });

  it("considera bônus no cálculo", () => {
    const result = calculate(100, 900, "g", 30, "g", 100);
    expect(result.totalDoses).toBe(33.33);
    expect(result.costPerDose).toBeCloseTo(3, 2);
  });

  it("retorna 0 doses se doseSize for 0", () => {
    const result = calculate(100, 900, "g", 0, "g");
    expect(result.totalDoses).toBe(0);
    expect(result.costPerDose).toBe(0);
  });

  it("kg com dose em ml", () => {
    const result = calculate(150, 2.5, "kg", 75, "g");
    expect(result.totalDoses).toBe(33.33);
    expect(result.costPerDose).toBeCloseTo(4.5, 2);
  });
});

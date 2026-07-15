import { describe, it, expect } from "vitest";
import { calculate } from "@/lib/calculator";

describe("calculate edge cases", () => {
  it("produto caro com dose pequena", () => {
    const result = calculate(999.9, 900, "g", 5, "g")
    expect(result.totalDoses).toBe(180)
    expect(result.costPerDose).toBeGreaterThan(0)
  })

  it("produto barato com dose grande", () => {
    const result = calculate(10, 1000, "g", 100, "g")
    expect(result.totalDoses).toBe(10)
    expect(result.costPerDose).toBe(1)
  })

  it("preço muito baixo", () => {
    const result = calculate(1, 100, "g", 1, "g")
    expect(result.costPerDose).toBe(0.01)
  })

  it("bonus maior que o peso original", () => {
    const result = calculate(100, 500, "g", 10, "g", 1000)
    expect(result.totalDoses).toBe(150)
    expect(result.costPerDose).toBeCloseTo(0.67, 2)
  })

  it("múltiplas unidades volumétricas", () => {
    const result = calculate(80, 500, "ml", 15, "ml")
    expect(result.totalDoses).toBe(33.33)
    expect(result.costPerDose).toBeCloseTo(2.4, 2)
  })
})

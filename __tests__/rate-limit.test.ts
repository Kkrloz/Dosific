import { describe, it, expect } from "vitest";

// Import directly to test isolation
const modulePath = "@/lib/rate-limit"

describe("rateLimit", () => {
  it("permite primeira requisição", async () => {
    const { rateLimit } = await import(modulePath)
    const key = `test:${Date.now()}:${Math.random()}`
    expect(rateLimit(key, 3, 1000)).toBe(true)
  })

  it("bloqueia após exceder limite", async () => {
    const { rateLimit } = await import(modulePath)
    const key = `test:${Date.now()}:${Math.random()}`
    expect(rateLimit(key, 2, 1000)).toBe(true)
    expect(rateLimit(key, 2, 1000)).toBe(true)
    expect(rateLimit(key, 2, 1000)).toBe(false)
  })

  it("chaves diferentes não interferem", async () => {
    const { rateLimit } = await import(modulePath)
    const a = `test-a:${Date.now()}:${Math.random()}`
    const b = `test-b:${Date.now()}:${Math.random()}`
    expect(rateLimit(a, 1, 1000)).toBe(true)
    expect(rateLimit(b, 1, 1000)).toBe(true)
    expect(rateLimit(a, 1, 1000)).toBe(false)
    expect(rateLimit(b, 1, 1000)).toBe(false)
  })
})

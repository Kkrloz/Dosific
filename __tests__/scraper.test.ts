import { describe, it, expect } from "vitest";
import { getSiteConfig } from "@/scraper/sites";

describe("getSiteConfig", () => {
  it("reconhece URL da Growth", () => {
    const config = getSiteConfig("https://www.growthsupplements.com.br/produto")
    expect(config).not.toBeNull()
    expect(config?.domain).toBe("growthsupplements.com.br")
  })

  it("reconhece URL da Amazon", () => {
    const config = getSiteConfig("https://www.amazon.com.br/produto")
    expect(config).not.toBeNull()
    expect(config?.domain).toBe("amazon.com.br")
  })

  it("reconhece URL do Mercado Livre", () => {
    const config = getSiteConfig("https://produto.mercadolivre.com.br/")
    expect(config).not.toBeNull()
    expect(config?.domain).toBe("mercadolivre.com.br")
  })

  it("retorna null para domínio não suportado", () => {
    const config = getSiteConfig("https://www.sitequalquer.com.br/produto")
    expect(config).toBeNull()
  })

  it("retorna null para URL inválida", () => {
    const config = getSiteConfig("not-a-url")
    expect(config).toBeNull()
  })
})

describe("SSRF Protection", () => {
  it("rejeita URLs internas", () => {
    const config = getSiteConfig("http://localhost:3000")
    expect(config).toBeNull()
  })

  it("rejeita IPs privados", () => {
    const config = getSiteConfig("http://192.168.1.1/admin")
    expect(config).toBeNull()
  })
})

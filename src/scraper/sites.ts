export interface SiteConfig {
  domain: string;
  priceSelector: string;
  nameSelector: string;
  attribute?: string;
  replace?: [string, string][];
  type: "cheerio" | "puppeteer";
}

export const sites: SiteConfig[] = [
  {
    domain: "growthsupplements.com.br",
    priceSelector: ".product-price",
    nameSelector: "h1.page-title",
    attribute: "text",
    replace: [["R$", ""], [".", ""], [",", "."]],
    type: "cheerio",
  },
  {
    domain: "maxnutrition.com.br",
    priceSelector: ".price",
    nameSelector: "h1",
    attribute: "text",
    replace: [["R$", ""], [".", ""], [",", "."]],
    type: "cheerio",
  },
  {
    domain: "integralmedica.com.br",
    priceSelector: ".price__current",
    nameSelector: "h1",
    attribute: "text",
    replace: [["R$", ""], [".", ""], [",", "."]],
    type: "cheerio",
  },
  {
    domain: "mercadolivre.com.br",
    priceSelector: ".andes-money-amount__fraction",
    nameSelector: ".ui-pdp-title",
    attribute: "text",
    replace: [[".", ""]],
    type: "cheerio",
  },
  {
    domain: "amazon.com.br",
    priceSelector: ".a-price-whole",
    nameSelector: "#productTitle",
    attribute: "text",
    replace: [[".", ""]],
    type: "cheerio",
  },
];

export function getSiteConfig(url: string): SiteConfig | null {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return sites.find((s) => hostname.includes(s.domain)) ?? null;
  } catch {
    return null;
  }
}

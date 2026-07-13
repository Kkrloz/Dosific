export interface SiteConfig {
  domain: string;
  selector: string;
  attribute?: string;
  replace?: [string, string][];
  type: "cheerio" | "puppeteer";
}

export const sites: SiteConfig[] = [
  {
    domain: "growthsupplements.com.br",
    selector: ".product-price",
    attribute: "text",
    replace: [["R$", ""], [".", ""], [",", "."]],
    type: "cheerio",
  },
  {
    domain: "maxnutrition.com.br",
    selector: ".price",
    attribute: "text",
    replace: [["R$", ""], [".", ""], [",", "."]],
    type: "cheerio",
  },
  {
    domain: "integralmedica.com.br",
    selector: ".price__current",
    attribute: "text",
    replace: [["R$", ""], [".", ""], [",", "."]],
    type: "cheerio",
  },
  {
    domain: "mercadolivre.com.br",
    selector: ".andes-money-amount__fraction",
    attribute: "text",
    replace: [[".", ""]],
    type: "cheerio",
  },
  {
    domain: "amazon.com.br",
    selector: ".a-price-whole",
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

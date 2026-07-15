import { getSiteConfig } from "./sites";

export interface ScrapeResult {
  price: number | null;
  method: "cheerio" | "puppeteer" | null;
  error?: string;
}

export interface ProductInfoResult {
  name: string | null;
  price: number | null;
  error?: string;
}

async function scrapeWithCheerio(url: string): Promise<number | null> {
  const cheerio = await import("cheerio");
  const axios = (await import("axios")).default;

  const config = getSiteConfig(url);
  if (!config || config.type !== "cheerio") return null;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    let text = $(config.priceSelector).first().text().trim();

    if (config.replace) {
      for (const [from, to] of config.replace) {
        text = text.replaceAll(from, to);
      }
    }

    const price = parseFloat(text);
    return isNaN(price) ? null : price;
  } catch {
    return null;
  }
}

async function scrapeWithPuppeteer(url: string): Promise<number | null> {
  try {
    const puppeteer = await import("puppeteer-core");
    const chromium = (await import("@sparticuz/chromium")).default;

    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });

    const text = await page.evaluate(() => {
      const el =
        document.querySelector(".price") ||
        document.querySelector(".product-price") ||
        document.querySelector('[class*="price"]');
      return el?.textContent?.trim() ?? "";
    });

    await browser.close();

    const cleaned = text
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();

    const price = parseFloat(cleaned);
    return isNaN(price) ? null : price;
  } catch {
    return null;
  }
}

const ALLOWED_DOMAINS = [
  "growthsupplements.com.br",
  "maxnutrition.com.br",
  "integralmedica.com.br",
  "mercadolivre.com.br",
  "amazon.com.br",
]

function isAllowedUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace("www.", "")
    return ALLOWED_DOMAINS.some((d) => hostname.includes(d))
  } catch {
    return false
  }
}

export async function scrapeProduct(url: string): Promise<ScrapeResult> {
  if (!isAllowedUrl(url)) {
    return { price: null, method: null, error: "Domain not allowed" }
  }
  let price = await scrapeWithCheerio(url);
  if (price !== null) return { price, method: "cheerio" };

  price = await scrapeWithPuppeteer(url);
  if (price !== null) return { price, method: "puppeteer" };

  const domain = isAllowedUrl(url) ? new URL(url).hostname.replace("www.", "") : url
  return { price: null, method: null, error: `Não foi possível extrair o preço de ${domain}. O layout da loja pode ter mudado.` };
}

async function fetchWithCheerioFull(url: string): Promise<{ name: string | null; price: number | null }> {
  const cheerio = await import("cheerio");
  const axios = (await import("axios")).default;

  const config = getSiteConfig(url);
  if (!config || config.type !== "cheerio") return { name: null, price: null };

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    const nameText = $(config.nameSelector).first().text().trim();
    const name = nameText || null;

    let priceText = $(config.priceSelector).first().text().trim();
    if (config.replace) {
      for (const [from, to] of config.replace) {
        priceText = priceText.replaceAll(from, to);
      }
    }
    const price = parseFloat(priceText);
    return {
      name,
      price: isNaN(price) ? null : price,
    };
  } catch {
    return { name: null, price: null };
  }
}

export async function scrapeProductInfo(url: string): Promise<ProductInfoResult> {
  if (!isAllowedUrl(url)) {
    return { name: null, price: null, error: "Domain not allowed" }
  }
  const result = await fetchWithCheerioFull(url);
  if (result.name || result.price) {
    return { name: result.name, price: result.price };
  }

  const domain = isAllowedUrl(url) ? new URL(url).hostname.replace("www.", "") : url
  return { name: null, price: null, error: `Não foi possível extrair dados de ${domain}. Tente preencher manualmente.` };
}

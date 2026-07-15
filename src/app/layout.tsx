import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Link from "next/link";
import Script from "next/script";
import { ThemeToggle } from "@/components/theme-toggle";
import { SessionProvider } from "@/components/session-provider";
import { HeaderAuth } from "@/components/header-auth";
import { MobileMenu } from "@/components/mobile-menu";
import { Search, Plus, Home, BarChart3 } from "lucide-react";
import { auth } from "@/lib/auth";
import { shouldShowAds, ADSENSE_PUBLISHER_ID, ADSENSE_ENABLED, ADSENSE_SLOTS } from "@/lib/adsense";
import { AdBanner } from "@/components/ad-banner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dosific",
  description: "Calcule e compare o custo por dose dos seus produtos",
  icons: {
    icon: "/icone-removebg-preview.png",
    shortcut: "/icone-removebg-preview.png",
    apple: "/icone-removebg-preview.png",
  },
  other: {
    "google-adsense-account": "ca-pub-5012986302679215",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const showAds = await shouldShowAds(session)
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SessionProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
              <div className="w-full px-4 py-2 flex items-center justify-between gap-4">
                {/* Left: Brand logo & Menu */}
                <div className="flex items-center gap-3 shrink-0">
                  <MobileMenu />
                  <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
                    <Image
                      src="/icone-removebg-preview.png"
                      alt="Dosific"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </Link>
                </div>

                {/* Center: Search Bar (YouTube style) */}
                <form action="/" method="GET" className="flex items-center flex-1 max-w-[640px]">
                  <div className="flex items-center flex-1 bg-muted/30 rounded-l-full border border-border focus-within:border-emerald-500/50 focus-within:bg-background px-4 py-1.5 transition-all">
                    <input
                      type="text"
                      name="q"
                      placeholder="Pesquisar produtos ou categorias..."
                      className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground text-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Pesquisar"
                    className="bg-muted hover:bg-muted/80 border border-l-0 border-border rounded-r-full px-5 py-2.5 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                  >
                    <Search className="size-4 text-muted-foreground" />
                  </button>
                </form>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <Link href="/#new-product" className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all">
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Criar</span>
                  </Link>
                  <HeaderAuth />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
              {/* Left Sidebar */}
              <aside className="w-60 shrink-0 hidden lg:flex flex-col border-r border-border/40 bg-background py-4 px-3 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
                <div className="space-y-1">
                  <Link href="/" className="flex items-center gap-4 px-4 py-2 rounded-xl bg-muted/60 text-primary font-semibold text-sm transition-all hover:bg-muted">
                    <Home className="size-5 text-emerald-500" />
                    <span>Início</span>
                  </Link>
                  <Link href="/#compare" className="flex items-center gap-4 px-4 py-2 rounded-xl text-muted-foreground font-medium text-sm transition-all hover:bg-muted hover:text-primary">
                    <BarChart3 className="size-5 text-muted-foreground" />
                    <span>Comparar</span>
                  </Link>
                  <Link href="/#new-product" className="flex items-center gap-4 px-4 py-2 rounded-xl text-muted-foreground font-medium text-sm transition-all hover:bg-muted hover:text-primary">
                    <Plus className="size-5 text-muted-foreground" />
                    <span>Adicionar</span>
                  </Link>
                </div>
                <div className="border-t border-border/40 my-4 pt-4 px-4">
                  <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">Dosific</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Calcule o custo-benefício de suplementos e produtos por dose.</p>
                  <AdBanner slot={ADSENSE_SLOTS.sidebar} format="rectangle" show={showAds} className="mt-4" />
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 min-w-0 bg-background">
                <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
                <footer className="border-t border-border/30 bg-muted/10 py-6 text-center text-xs text-muted-foreground mt-8">
                  <p className="font-semibold text-primary/70">Dosific — Inteligência em Custo por Dose</p>
                  <p className="text-muted-foreground/80 mt-1">Feito para simplificar suas escolhas e economizar o seu dinheiro.</p>
                </footer>
              </main>
            </div>
          </div>
          </SessionProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
              },
            }}
          />
          {ADSENSE_PUBLISHER_ID && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dosific",
  description: "Calcule e compare o custo por dose dos seus produtos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 group transition-transform duration-200 active:scale-95">
                <div className="relative size-8 overflow-hidden rounded-lg bg-emerald-500/10 p-1 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-colors">
                  <Image
                    src="/logo.png"
                    alt="Dosific"
                    width={32}
                    height={32}
                    className="size-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent tracking-tight">
                  Dosific
                </span>
              </a>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 bg-grid">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">{children}</div>
          </main>
          <footer className="border-t border-border/30 bg-muted/20 py-8 text-center text-sm text-muted-foreground">
            <div className="max-w-7xl mx-auto px-4">
              <p className="font-semibold text-primary/70">Dosific — Inteligência em Custo por Dose</p>
              <p className="text-xs mt-1 text-muted-foreground/80">Feito para simplificar suas escolhas e economizar o seu dinheiro.</p>
            </div>
          </footer>
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
        </ThemeProvider>
      </body>
    </html>
  );
}

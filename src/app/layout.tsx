import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <a href="/" className="text-xl font-bold text-primary tracking-tight">
                Dosific
              </a>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 bg-grid">
            <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
          </main>
          <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
            <p>Dosific — Custo por dose inteligente</p>
            <p className="text-xs mt-1">Feito para quem quer economizar</p>
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

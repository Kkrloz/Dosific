import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-primary">
              Dosific
            </a>
          </div>
        </header>
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
        </main>
        <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
          Dosific — Custo por dose inteligente
        </footer>
      </body>
    </html>
  );
}

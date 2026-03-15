import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Bangladesh Public Holidays",
  description: "A fast, SEO-optimized, and premium public holiday calendar for Bangladesh.",
  icons: {
    icon: "https://flagcdn.com/w80/bd.png",
    apple: "https://flagcdn.com/w80/bd.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-900 bg-slate-50 dark:text-slate-50 dark:bg-slate-950 transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

        <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/20 dark:border-white/5">
          <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shadow-lg shadow-brand-500/30 shrink-0 border-2 border-white dark:border-slate-800 animate-[wave_2.5s_ease-in-out_infinite] origin-bottom">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://flagcdn.com/w80/bd.png" 
                  alt="Bangladesh Flag" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-outfit font-bold text-lg md:text-xl tracking-tight">Holidays.</span>
            </div>
            <nav className="flex items-center gap-4 md:gap-8 font-medium text-xs md:text-sm">
              <a href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Calendar</a>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="pt-32 pb-20 min-h-screen">
          {children}
        </main>

        <footer className="glass-panel border-t border-white/20 dark:border-white/5 mt-auto">
          <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2026 BD Holidays. All rights reserved.
            </p>

          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

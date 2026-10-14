import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SalesPlus Auto Mart — Premier Vehicle Dealership & Direct Importer",
    template: "%s | SalesPlus Auto Mart",
  },
  description:
    "Explore certified brand-new, reconditioned, and premium pre-owned vehicles in Sri Lanka. Multi-point inspected inventory, bespoke leasing, test drive booking, and trade-in valuations.",
  keywords: [
    "Vehicle Dealership Colombo",
    "Cars for Sale Sri Lanka",
    "Japanese Direct Imports",
    "Auto Leasing Sri Lanka",
    "Toyota Premio Vezel BYD",
    "Certified Pre-Owned Cars",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://salesplus.lk"),
  openGraph: {
    title: "SalesPlus Auto Mart — Premier Vehicle Dealership",
    description:
      "Explore certified vehicle inventory, compare specs, calculate monthly lease installments, and book private showroom viewings.",
    type: "website",
    locale: "en_LK",
    siteName: "SalesPlus Auto Mart",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${interFont.variable} h-full antialiased selection:bg-amber-400 selection:text-slate-950`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

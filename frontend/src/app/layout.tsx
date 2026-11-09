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
    default: "MANTHUSA TVS — Official TVS Motorcycle Dealership",
    template: "%s | MANTHUSA TVS",
  },
  description:

    "TVS Motorcycles Sri Lanka",
    "TVS Apache RTR 160 4V",
    "TVS Apache RTR 200 4V",
    "TVS Apache RR 310",
    "TVS NTORQ 125 Race Edition",
    "TVS Jupiter 125",
    "TVS Raider 125",
    "Motorcycle Leasing Sri Lanka",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://manthusatvs.lk"),
  openGraph: {
    title: "MANTHUSA TVS — Official TVS Motorcycle Dealer",
    description:
      "Explore official TVS motorcycles, compare specs, calculate monthly lease installments, and book private test rides at MANTHUSA TVS.",
    type: "website",
    locale: "en_LK",
    siteName: "MANTHUSA TVS",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
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

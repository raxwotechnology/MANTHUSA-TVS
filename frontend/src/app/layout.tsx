import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Vehicle Sales Management System",
  description: "Comprehensive vehicle dealership inventory, CRM, sales & finance management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${interFont.variable} h-full antialiased selection:bg-emerald-500 selection:text-white`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}


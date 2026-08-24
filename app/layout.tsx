import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quran Insights — AI-Powered Quranic Q&A & Wisdom",
  description:
    "Explore divine wisdom, search verses across themes, and discover authentic translations with AI-powered semantic understanding and verified Quranic citations.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-screen bg-[#070d14] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
